export default ({ websiteName, formattedArticle, moreInfo, archiveUrl }) => [
  `^(It looks like this is a link to ${websiteName}. Do you really need to read the full thing?)`,
  '^(Here\'s a summary and a few images. More info below)',
  '----',
  formattedArticle,
  '----',
  moreInfo,
  archiveUrl ? `[^(View archived page at archive.is)](${archiveUrl})` : null,
  '^(Problems or suggestions? Check out /r/dontclickbot. I\'m open source!)',
].join('\n\n');
