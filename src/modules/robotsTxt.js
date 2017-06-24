import robots from 'robots';
import config from 'config';

import { urlParts } from 'utils/urls';

export default (fullUrl) => new Promise((resolve, reject) => {
  const parts = urlParts(fullUrl);
  const robotsTxt = `${parts.httpwww + parts.domain}/robots.txt`;

  (new robots.RobotsParser()).setUrl(robotsTxt, (parser, success) => {
    if (success) {
      parser.canFetch(config.userAgent, parts.path, (access) => {
        console.log({
          path: parts.path,
          robotsTxt,
          parts,
          access,
        })
        if (access) resolve();
        reject('robots.txt prevents us from scraping');
      });
    }
    reject('Can\'t load robots.txt');
  });
});
