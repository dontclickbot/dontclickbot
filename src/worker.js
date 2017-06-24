import 'env';
import sleep from 'sleep-promise';

import { postQueue } from 'modules/queue';
import domainMap from 'scrapers';
import logger from 'modules/logger';
import archiver from 'modules/archiver';
import { createComment } from 'modules/reddit';
import commentTemplate from 'commentTemplate';

postQueue.process(async ({ data }) => {
  await sleep(2000);
  logger(`Scraping ${data.url} (ID: ${data.id})...`);

  // Get the relevant scraper and run it:
  const Scraper = domainMap[data.domain];
  const scraper = new Scraper(data.url);
  await scraper.run();

  if (!scraper.formattedArticle) throw new Error('Error scraping article');

  // Archive the article:
  try {
    logger('Archiving page with archive.is..');
    const archiveUrl = await archiver(data.url);
    scraper.archiveUrl = archiveUrl;
  } catch (error) {
    throw new Error(`Archiving error: ${error.message}`);
  }

  // Format the comment and post to Reddit:
  const text = commentTemplate(scraper);
  await createComment({ postId: data.id, text });
  logger('Done');
  // TODO: Pause queue for x seconds where x is the wait time in the error json
});
