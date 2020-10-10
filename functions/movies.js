require("dotenv").config();
const { URL } = require("url");
const fetch = require("node-fetch");

const movies = require("../data/movies.json");

exports.handler = async () => {
  const api = new URL("https://www.omdbapi.com/");

  // add secret api key
  api.searchParams.set("apikey", process.env.OMDB_API_KEY);

  // https://www.learnwithjason.dev/blog/keep-async-await-from-blocking-execution/
  /*
  const promises and promise.all is creating an array of promises that will execute the api fetch in parallel and wait for all of the api fetch to be completed before going to the next step
  */
  const promises = movies.map((movie) => {
    api.searchParams.set("i", movie.id);

    return fetch(api)
      .then((response) => response.json())
      .then((data) => {
        const scores = data.Ratings;
        console.log("data", data);

        console.log("data with ratings", scores);
        // once you get the scores return all of the movies with their scores
        // console.log("movies", { ...movies, scores });
        return {
          ...movie,
          scores,
        };
      });
  });

  // return the movies with ratings
  const moviesWithRatings = await Promise.all(promises);

  return {
    statusCode: 200,
    body: JSON.stringify(moviesWithRatings),
  };
};
