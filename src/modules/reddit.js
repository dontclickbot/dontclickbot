import Snoocore from 'snoocore';

const {
  REDDIT_KEY,
  REDDIT_SECRET,
  REDDIT_USERNAME,
  REDDIT_PASSWORD,
} = process.env;

export const reddit = new Snoocore({
  userAgent: 'dontclickbot@0.0.1',
  oauth: {
    type: 'script',
    key: REDDIT_KEY,
    secret: REDDIT_SECRET,
    username: REDDIT_USERNAME,
    password: REDDIT_PASSWORD,
    redirectUri: 'https://reddit.com/u/dontclickbot',
    scope: ['identity', 'read', 'submit'],
  },
});

export const fetchPostsForDomain = async (domain) =>
  (await reddit(`/domain/${domain}/new/`).get()).data.children;

export const createComment = async ({ postId, text }) => {
  try {
    await reddit('/api/comment').post({
      thing_id: `t3_${postId}`,
      text,
    });
  } catch (e) {
    console.log(e.body);
  }
};
