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
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  database: process.env.POSTGRES_DBNAME 
});

exports.lambdaHandler = async function (event) {
  console.log("test log");
  await client
    .connect()
    .then(() => {
      console.log("Successfully connected to the DB!");
    })
    .catch((err) => {
      console.log(`Hmmm, error: ${err}`);
    });
  let body = await getAllUserChores();
  client.end();
  return {
    "statusCode": 200,
    "body": body
  }
}

function getAllUserChores() {
  return client
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
      return res.rows;
    })
    .catch((err) => {
      return err;
    });
}
