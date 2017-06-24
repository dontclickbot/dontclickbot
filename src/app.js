import 'env';

import watcher from 'watcher';
import domainMap from 'scrapers';

/*
  Start domain watchers
*/

Promise.all(
  Object.keys(domainMap)
    .map(watcher),
);
