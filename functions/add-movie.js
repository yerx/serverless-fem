exports.handler = async (event) => {
  console.log(event);

  const { id, title, tagline, poster } = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: "wip",
  };
};
