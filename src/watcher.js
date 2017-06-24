import sleep from 'sleep-promise';
import config from 'config';

import { fetchPostsForDomain } from 'modules/reddit';
import logger from 'modules/logger';
import redis from 'modules/redis';
import { scrapeQueue } from 'modules/queue';

import { isImage } from 'utils/urls';

export default async (domain) => {
  const watcherName = `[${domain} watcher]`;
  for (;;) {
    try {
      logger(`${watcherName}: Fetching Reddit posts from ${domain}...`);
      const posts = await fetchPostsForDomain(domain);
      // eslint-disable-next-line no-restricted-syntax
      for (const { data } of posts) {
        if (
          // The sub isn't in our blacklist
          !config.blacklist.includes(data.subreddit.toLowerCase()) &&
          // it's not an image
          !isImage(data.url) &&
          // we haven't already dealt with this post:
          !await redis.get(data.id)
        ) {
          scrapeQueue.add(data);
          logger(`${watcherName}: Added ${data.id} to scrape queue`);
          await redis.set(data.id, data.url);
        }
      }
      await sleep(180 * 1000);
    } catch (e) {
      logger(e);
    }
  }
};
