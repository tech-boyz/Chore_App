/* eslint-disable no-unused-vars */
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
const { Client } = require("pg");
const schema = process.env.NODE_ENV === "production" ? "public" : "dev";

exports.failureResponse = {
  statusCode: 500,
  body: "Oopsies. Something went wrong :("
};

exports.lambdaHandler = async function (event) {
  console.log("test log");
  console.log(schema);
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DBNAME
  });

  const queryResponse = await exports.getAllUserChores(client);
  queryResponse.body = JSON.stringify(queryResponse.body);

  return {
    ...queryResponse,
    isBase64Encoded: false,
    headers: {
      my_header: "my_value"
    }
  };
};

exports.getAllUserChores = function getAllUserChores (client) {
  return client
    .connect()
    .then(() => {
      console.log("Successfully connected to the DB!");
      return queryUserChores(client);
    })
    .then((queryResponse) => {
      return disconnectDB(client, queryResponse);
    })
    .catch((err) => {
      console.log(`There was an error :( -> ${err}`);
      return exports.failureResponse;
    });
};

function queryUserChores (client) {
  return client
    .query(`
        SELECT ${schema}."Users".first_name
         ,${schema}."Users".last_name
         ,${schema}."Chores".chore_name
         ,${schema}."Chores".chore_description
         ,${schema}."Chores".completed
        FROM ${schema}."Chores"
        INNER JOIN ${schema}."Users"
          ON ${schema}."Users".user_id=${schema}."Chores".assigned_to
      `)
    .then((res) => {
      return {
        body: res.rows,
        statusCode: 200
      };
    })
    .catch((err) => {
      console.log(`Error occured in querying User's Chores: ${err}`);
      return exports.failureResponse;
    });
}

function disconnectDB (client, queryResponse) {
  return client
    .end()
    .then(() => {
      console.log("Successfully disconnected from DB");
      return queryResponse;
    });
}
