/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
const { Client } = require('pg');
exports.failureResponse = {
     statusCode: 500,
     body: "Oopsies. Something went wrong :("
   };

exports.lambdaHandler = async function (event) {
  console.log("test log");
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DBNAME 
  });

  let queryResponse = await exports.getAllUserChores(client);

  return {
    "statusCode": queryResponse.statusCode,
    "isBase64Encoded": false,
    "headers": {
            "my_header": "my_value"
        },
    "body": JSON.stringify(queryResponse.body)
  }
}

exports.getAllUserChores = async function getAllUserChores(client) {
   var queryResponse = null;

   await client
    .connect()
    .then(() => {
      console.log("Successfully connected to the DB!");
    })
    .catch((err) => {
      console.log(`Hmmm, error: ${err}`);
      queryResponse = exports.failureResponse;
    });
  if(queryResponse == null){
    await client
      .query(`
        SELECT "Users".first_name
	       ,"Users".last_name
	       ,"Chores".chore_name
	       ,"Chores".chore_description
	       ,"Chores".completed
        FROM "Chores"
        INNER JOIN "Users"
        	ON "Users".user_id="Chores".assigned_to
      `)
      .then((res) => {
        queryResponse = {
          body:res.rows,
          statusCode: 200
        };
      })
      .catch((err) => {
        console.log(err);
        queryResponse = exports.failureResponse;
      });
  }
  await client
    .end()
    .then(() => console.log('client has disconnected'))
    .catch(err => {
      console.error('error during disconnection', err.stack);
      queryResponse = exports.failureResponse;
    });
  return queryResponse;
}