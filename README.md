
# 🤖 [/u/dontclickbot](https://reddit.com/u/dontclickbot)
Reddit bot which formats article posts into Reddit comments for certain websites

----

Run `yarn` to install dependencies

Start watcher (watches Reddit for new posts from domains):

`yarn start`

Start worker (runs the scrape queue and the comment queue):

`yarn worker`

> If you wish you could instead `yarn build` and then `yarn start:prod` and `yarn worker:prod` to run pre-transpiled code.

## Contribute

Setup a .env file in the root dir with `REDIS_URL=redis://localhost:6379` (or some other redis url).

### Overview of how `dontclickbot` works

`dontclickbot` loads each file in the `scrapers` directory and uses the static `domain` property to look for new Reddit posts at `http://reddit.com/domain/<domain>`.

It adds each post it finds to the `postQueue` (which uses [Bull](https://github.com/OptimalBits/bull)).

For each `postQueue` job, it pulls the relevant `Scraper` from the `domainMap` and creates a new instance (`scraper`) with the provided URL and runs (`scraper.run()`).

After it runs, the instance will have the following relevant info as properties: `websiteName`, `formattedArticle`, and `moreInfo`. These are formatted with the `commentTemplate` and then posted to Reddit.

### How each `Scraper` works

Take a look at `scrapers/dailyMail.js`. Scraping uses [cheerio](https://github.com/cheeriojs/cheerio).

The main instance methods are `article()`, `scrape()`, and `formattedArticle()`.

#### `article()`

This simply returns the main article element.

#### `scrape()`

Returns an object, properties are usually strings or arrays. E.g. `headline` or `images`.

Example:

```js
{
  images: article.find('div[itemprop=articleBody] > .mol-img-group')
    .map((i, el) => ({
      src: $(el).find('img').attr('data-src'),
      caption: $(el).find('.imageCaption').text(),
    })).toArray(),
}
```

First we get article.find to find all elements with the class `mol-img-group` inside the `<div itemprop="articleBody" />` (which is inside the `<div class="articleWide" />` referred to in `article()`).

We `map()` through each element (note: this is `Cheerio`'s map, not the built-in `Array.map()`) and return an object with `src` and `caption` properties. Then we convert the `Cheerio` "array" into a regular JS array.

>Note: The `scrape()` method don't actually take any paremeters. The parameters are simply deconstructing the `this` object to set the default `$` and `article` values. This saves us from typing out `this.$` and `this.article` everywhere while letting us still use an arrow function to directly return an object.

#### `formattedArticle`

This takes in the object returned by from `scrape()` and returns a string.

### Todo:

- Process article links which people post in comments too!
- Add delay between starting each watcher (`Promise.all` will run them simultaneously)
- Add more scrapers
- It currently waits a few minutes between comments, instead of the minimum time reddit provides in the response body of an error

PRs would be seriously appreciated for any of these, especially the one for dealing with article links in comments. This is my first Reddit bot so I'm not too familiar with the API.

## Other

If you want to create your own Reddit bot based on this bot there are also the following env variables:

```
REDDIT_KEY=xxx
REDDIT_SECRET=xxx
REDDIT_USERNAME=xxx
REDDIT_PASSWORD=xxx
```
