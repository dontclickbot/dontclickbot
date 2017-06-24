import importDir from 'import-dir';

const dir = importDir('.');

const domainMap = {};

Object.keys(dir)
  .filter(key => key !== 'index')
  .map(key => dir[key])
  .forEach(Scraper => {
    domainMap[Scraper.domain] = Scraper;
  });

export default domainMap;
