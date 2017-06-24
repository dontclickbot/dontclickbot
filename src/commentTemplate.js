export default ({ websiteName, formattedArticle, moreInfo, archiveUrl }) => [
  `^(Do you really want to click a link to ${websiteName}?)`,
  '^(Here\'s a summary and a few images. More info below)',
  archiveUrl ? `[^(View archived article at archive.is)](${archiveUrl})` : null,
  '----',
  formattedArticle,
  '----',
  moreInfo,
  '^(Problems or suggestions? Check out /r/dontclickbot. I\'m open source!)',
].join('\n\n');
