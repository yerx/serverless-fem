// add dotenv
require("dotenv").config();
// add the node fetch module
const fetch = require("node-fetch");

/*
 * declare an async function to perform a POST request
 * pass in the query and for variables set the default to an empty object
 */
async function query({ query, variables = {} }) {
  // fetch the data from the Hasura GraphQL API
  // perform a post request
  const result = await fetch(process.env.HAUSRA_API_URL, {
    method: "POST",
    headers: {
      // indicate the data type which is json
      "Content-Type": "application/json",
      // add the Hasura admin secret key
      "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables }),
  }).then((response) => response.json());

  // return the result data
  return result.data;
}

exports.query = query;
