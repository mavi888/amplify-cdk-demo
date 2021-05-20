exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event));
  
    // return response back to upstream caller
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify('HELLLLOOO'),
    };
  };