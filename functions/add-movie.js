const { query } = require("./utils/hasura");

exports.handler = async (event, context) => {
  // Netlify identity handles the authorization, inside the context object is the user information
  // console.log(context);
  // the body will be a JSON object so parse it
  const { id, title, tagline, poster } = JSON.parse(event.body);
  // we are grabbing the data that was sent into the serverless app JWT
  const { user } = context.clientContext;
  // check if user is logged in
  const isLoggedIn = user && user.app_metadata && user.app_metadata.roles;
  // check if the user has roles
  const roles = isLoggedIn ? user.app_metadata.roles : [];

  if (!isLoggedIn || !roles.includes("admin")) {
    return {
      statusCode: 401,
      body: "Not authorized",
    };
  }

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
