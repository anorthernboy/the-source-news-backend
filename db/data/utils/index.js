exports.formatArticles = (articleData, topicRef, userRef) => {

  return articleData.map((article) => {

    const {
      topic,
      created_by,
      ...restOfArticle
    } = article;

    return {
      topic: topicRef.slug,
      created_by: userRef.username,
      ...restOfArticle
    };
  });


  // return articleData.map((article) => {
  //   article.topic = topicRef.slug
  //   article.created_by = userRef.username
  // });
}


exports.formatComments = (commentData, userRef, articleRef) => {

  return commentData.map((comment) => {

    const {
      created_by,
      belongs_to,
      ...restOfComment
    } = comment;

    return {
      created_by: userRef.username,
      belongs_to: articleRef.article_id,
      ...restOfComment
    };
  });



  // return commentData.map((comment) => {
  //   comment.created_by = userRef.username
  //   comment.belongs_to = articleRef.article_id
  // });
}