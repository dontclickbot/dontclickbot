import stripTags from 'striptags';
import Scraper from 'modules/scraper';

const clean = (string) => stripTags(string.trim().replace(/(\n|\s\s)/g, ' '));

export default class DailyMail extends Scraper {
  static domain = 'dailymail.co.uk'
  static websiteName = 'the Daily Mail'

  article = () => this.$('.articleWide')

  scrape = ({ $, article } = this) => ({
    headline: $(article.find('h1')).first().text(),
    bullets: article.find('h1 + ul > li')
      .map((i, el) => $(el).text()).toArray(),
    body: article.find('div[itemprop=articleBody] > p')
      .map((i, el) => clean($(el).html()).toString().replace(/Scroll down ([a-zA-Z0-9]+\s)*/, ''))
      .toArray().join('\n\n'),
    images: article.find('div[itemprop=articleBody] > .mol-img-group')
      .map((i, el) => ({
        src: $(el).find('img').attr('data-src'),
        caption: $(el).find('.imageCaption').text(),
      })).toArray(),
  })

  formattedArticle = (article = this.scrape()) => {
    if (!article.headline) return false;
    return [
      `# ${article.headline}`,
      `${article.bullets.map(bullet => `* **${bullet.trim()}**`).join('\n')}`,
      '### Summary of article:',
      this.summarized,
      (article.images.length > 0) ? '### Images' : null,
      `${article.images.slice(0, 3).map(image => `* [${image.caption}](${image.src})`).join('\n')}`,
    ].join('\n\n');
  }

  moreInfo = '[^(Why does everyone hate the Daily Mail?)](http://np.reddit.com/r/OutOfTheLoop/comments/3fh0qh/why_does_everyone_hate_the_daily_mail/)'
}
