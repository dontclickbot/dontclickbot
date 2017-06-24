/* eslint-disable no-useless-escape */

export const isImage = (url) =>
  url.endsWith('.jpg') ||
  url.endsWith('.jpeg') ||
  url.endsWith('.png');

const urlRegex = /(http[s]?:\/\/(?:www\.)?)([^\/\s]+)(\/.*)/;

export const urlParts = (url) => ({
  httpwww: url.match(urlRegex)[1],
  domain: url.match(urlRegex)[2],
  path: url.match(urlRegex)[3],
});
