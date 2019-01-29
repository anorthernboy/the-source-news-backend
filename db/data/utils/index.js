exports.createRef = (arr, column) => {
  return arr.reduce((acc, curr) => {
    acc[curr[column]] = curr[column]
    return acc;
  }, {})
}

exports.createArticleRef = (arr, col1, col2) => {
  return arr.reduce((acc, curr) => {
    acc[curr[col1]] = curr[col2]
    return acc;
  }, {})
}

const createTime = (num) => {
  const numDate = new Date(num)
  return numDate.toDateString()
}

exports.formatArticles = (articleData, topicRef, userRef) => {

  return articleData.map((article) => {

    const {
      topic,
      created_by,
      created_at,
      ...restOfArticle
    } = article;

    return {
      topic: topicRef[topic],
      created_by: userRef[created_by],
      created_at: createTime(created_at),
      ...restOfArticle,
    };
  });
}


exports.formatComments = (commentData, userRef, articleRef) => {

  return commentData.map((comment) => {

    const {
      created_by,
      belongs_to,
      created_at,
      ...restOfComment
    } = comment;

    return {
      created_by: userRef[created_by],
      belongs_to: articleRef[belongs_to],
      created_at: createTime(created_at),
      ...restOfComment,
    };
  });
}