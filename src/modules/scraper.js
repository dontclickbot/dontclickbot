import cheerio from 'cheerio';
import fetch, { Headers } from 'node-fetch';
import config from 'config';
import summarize from 'summary-bot';

export default class Scraper {
  constructor(url) {
    this._url = url;
    this.websiteName = this.constructor.websiteName;
  }
  run = async () => {
    try {
      const headers = new Headers({ 'User-Agent': config.userAgent });
      const html = await fetch(this._url, { headers }).then(res => res.text());
      const $ = await cheerio.load(html);
      this.$ = $;
      this.article = this.article();
      const { body } = this.scrape();
      this.summarized = summarize(body, 3)
        .bestSentences
        .map(sentence => sentence.value)
        .join('\n\n');
      this.formattedArticle = this.formattedArticle();
    } catch (error) {
      throw new Error(`Error in scraper.run(): ${error.message}`);
    }
  }
}
