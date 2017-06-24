import Horseman from 'node-horseman';

const horseman = new Horseman();

export default async (url) => {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
  try {
    const archiveUrl = await horseman.userAgent(userAgent)
      .open(`http://archive.is/?url=${url}`)
      .waitForSelector('#submiturl', { timeout: 6000 })
      .click('#submiturl input[type=submit]')
      .waitForNextPage({ timeout: 180 * 1000 })
      .url()
      .log()
      .waitForSelector('#HEADER', { timeout: 180 * 1000 })
      .url();
    if (archiveUrl.split('/')[3].length === 5) return archiveUrl;
    console.log(`archiver.js error: ${archiveUrl}`);
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
