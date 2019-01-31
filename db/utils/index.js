exports.createRef = (arr, column) => {
  if (arr.length === 0) {
    return {};
  }
  if (!column) {
    return {};
  }
  return arr.reduce((acc, curr) => {
    acc[curr[column]] = curr[column];
    return acc;
  }, {});
};

exports.createArticleRef = (arr, col1, col2) => {
  if (arr.length === 0) {
    return {};
  }
  if (!col1 || !col2) {
    return {};
  }
  return arr.reduce((acc, curr) => {
    acc[curr[col1]] = curr[col2];
    return acc;
  }, {});
};

exports.createTime = (num) => {
  const numDate = new Date(num);
  return numDate.toDateString();
};

const createTime = (num) => {
  const numDate = new Date(num);
  return numDate.toDateString();
};

exports.formatArticles = (articleData, topicRef, userRef) => {
  if (articleData.length === 0) {
    return [{}];
  }
  if (!topicRef || !userRef) {
    return [{}];
  }
  return articleData.map((article) => {
    const {
      topic,
      created_by,
      created_at,
      ...restOfArticle
    } = article;
    return {
      topic: topicRef[topic],
      username: userRef[created_by],
      created_at: createTime(created_at),
      ...restOfArticle,
    };
  });
};

exports.formatComments = (commentData, userRef, articleRef) => {
  if (commentData.length === 0) {
    return [{}];
  }
  if (!userRef || !articleRef) {
    return [{}];
  }
  return commentData.map((comment) => {
    const {
      created_by,
      belongs_to,
      created_at,
      ...restOfComment
    } = comment;
    return {
      username: userRef[created_by],
      article_id: articleRef[belongs_to],
      created_at: createTime(created_at),
      ...restOfComment,
    };
  });
};
