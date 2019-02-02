const createRef = (array, originValue, originKey) => {
  if (array.length === 0) {
    return {};
  }
  if (!originValue || !originKey) {
    return {};
  }
  return array.reduce((acc, curr) => {
    acc[curr[originValue]] = curr[originKey];
    return acc;
  }, {});
};

const createTime = (num) => {
  const numDate = new Date(num);
  return numDate.toDateString();
};

const formatArticles = (articleData) => {
  if (articleData.length === 0) {
    return [{}];
  }
  return articleData.map((article) => {
    const {
      created_by,
      created_at,
      ...restOfArticle
    } = article;
    return {
      username: created_by,
      created_at: createTime(created_at),
      ...restOfArticle,
    };
  });
};

const formatComments = (commentData, articleRef) => {
  if (commentData.length === 0) {
    return [{}];
  }
  if (!articleRef) {
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
      username: created_by,
      article_id: articleRef[belongs_to],
      created_at: createTime(created_at),
      ...restOfComment,
    };
  });
};

module.exports = {
  createRef,
  createTime,
  formatArticles,
  formatComments,
};
