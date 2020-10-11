// add the query module
const { query } = require("./utils/hasura");

exports.handler = async (event) => {
  // the body will be a JSON object so parse it
  const { id, title, tagline, poster } = JSON.parse(event.body);

  // add a query
  const result = await query({
    // paste the query from Hasura GRAPHIQL mutation and replace $id: String = "" with an $id: String! the '!' in GraphQL makes the field required
    query: `
    mutation addMovie($id: String!, $poster: String!, $tagline: String!, $title: String!) {
      insert_movies_one(object: {id: $id, poster: $poster, tagline: $tagline, title: $title}) {
        id
        poster
        tagline
        title
      }
    }
    `,
    variables: { id, title, tagline, poster },
  });

  // return the query result in the body
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
