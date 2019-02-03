exports.getEndpoints = (req, res, next) => {
  res.status(200).json({

    topics: {
      '/api/topics': {
        methods: {
          GET: 'responds with an array of all topic objects',
          POST: 'adds a topic object and responds with the new topic object if successful',
        },
        errors: {
          GET: {
            404: 'the path does not exist in the api',
          },
          POST: {
            400: 'the body is not in the correct form',
            422: 'an element of the body is not valid',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
      '/api/topics/:topic/articles': {
        methods: {
          GET: 'responds with an array of article objects for the given topic',
          POST: 'adds a article object and responds with the new article object if successful',
        },
        queries: {
          GET: {
            limit: 'the number of responses required, defaults to ten objects',
            sort_by: 'the object key to sort data by, defaults to date_created',
            p: 'the page of results which should be displayed, defaults to page one',
            order: 'can be set to asc or desc for any sort_by value, defaults to desc',
          },
        },
        errors: {
          GET: {
            400: 'the parameter does not exist',
            404: 'the path does not exist in the api',
          },
          POST: {
            400: 'the parameter does not exist or the body is not in the correct form',
            404: 'the path does not exist in the api',
            422: 'an element of the body is not valid',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
    },

    articles: {
      '/api/articles': {
        methods: {
          GET: 'responds with an array of all article objects',
        },
        queries: {
          GET: {
            limit: 'the number of responses required, defaults to ten objects',
            sort_by: 'the object key to sort data by, defaults to date_created',
            p: 'the page of results which should be displayed, defaults to page one',
            order: 'can be set to asc or desc for any sort_by value, defaults to desc',
          },
        },
        errors: {
          GET: {
            404: 'the path does not exist in the api',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
      '/api/articles/:article_id': {
        methods: {
          GET: 'responds with an article object for the given article_id',
          PATCH: 'updates the vote property of a specified article object and responds with the new article object if successful',
          DELETE: 'deletes an article specified by article_id and responds with a 204 status code if successful',
        },
        errors: {
          GET: {
            400: 'the parameter does not exist or is not in the correct form (integer)',
            404: 'the path does not exist in the api',
          },
          PATCH: {
            400: 'the parameter does not exist or is not in the correct form (integer)',
            404: 'the path does not exist in the api',
          },
          DELETE: {
            400: 'the parameter does not exist or is not in the correct form (integer)',
            404: 'the path does not exist in the api',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
      '/api/articles/:article_id/comments': {
        methods: {
          GET: 'responds with an array of comment objects for the given article_id',
          POST: 'adds a comment object and responds with the new comment object if successful',
        },
        queries: {
          GET: {
            limit: 'the number of responses required, defaults to ten objects',
            sort_by: 'the object key to sort data by, defaults to date_created',
            p: 'the page of results which should be displayed, defaults to page one',
            order: 'can be set to asc or desc for any sort_by value, defaults to desc',
          },
        },
        errors: {
          GET: {
            400: 'the parameter does not exist or is not in the correct form (integer)',
            404: 'the path does not exist in the api',
          },
          POST: {
            400: 'the parameter does not exist or is not in the correct form (integer)',
            404: 'the path does not exist in the api',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
      '/api/articles/:article_id/comments/:comment_id': {
        methods: {
          PATCH: 'updates the vote property of a specified comment object and responds with the new comment object if successful',
          DELETE: 'deletes an comment specified by comment_id and responds with a 204 status code if successful',
        },
        errors: {
          PATCH: {
            400: 'one or both parameters do not exist are not in the correct form (integer)',
            404: 'the path does not exist in the api',
          },
          DELETE: {
            400: 'one or both parameters do not exist are not in the correct form (integer)',
            404: 'the path does not exist in the api',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
    },

    users: {
      '/api/users': {
        methods: {
          GET: 'responds with an array of all user objects',
          POST: 'adds a comment object and responds with the new comment object if successful',
        },
        errors: {
          GET: {
            404: 'the path does not exist in the api',
          },
          POST: {
            400: 'the body is not in the correct form',
            404: 'the path does not exist in the api',
            422: 'an element of the body is not valid',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
      '/api/users/:username': {
        methods: {
          GET: 'responds with a username object for the given username',
        },

        errors: {
          GET: {
            400: 'the parameter does not exist',
            404: 'the path does not exist in the api',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
      '/api/users/:username/articles': {
        methods: {
          GET: 'responds with an array of article objects for the given username',
        },
        queries: {
          GET: {
            limit: 'the number of responses required, defaults to ten objects',
            sort_by: 'the object key to sort data by, defaults to date_created',
            p: 'the page of results which should be displayed, defaults to page one',
            order: 'can be set to asc or desc for any sort_by value, defaults to desc',
          },
        },
        errors: {
          GET: {
            400: 'the parameter does not exist',
            404: 'the path does not exist in the api',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
    },

    comments: {
      '/api/comments': {
        methods: {
          GET: 'responds with an array of all comment objects',
        },
        errors: {
          GET: {
            404: 'the path does not exist in the api',
          },
          'OTHER METHODS': {
            405: 'the method is not available on this path',
          },
        },
      },
    },
  });
};
