/* eslint-disable no-unused-vars */

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 *
 */

const { Client } = require("pg");

exports.lambdaHandler = async function (event) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DBNAME
  });
  await rotateChores(client);
};
// not very SOLID of me. Consider refactoring.
async function rotateChores (client) {
  return client
    .connect()
    .then(() => {
      console.log("Successfully connected to the DB!")
      return getChoreAssignments(client);
    })
    .then((choreAssignment) => {
      return rotateChoreAssignment(choreAssignment);
    })
    .then((newChoreAssignment) => {
      setChoreAssignment(newChoreAssignment, client);
    })
    .catch((err) => {
      disconnectDb(client);
      console.log(`There was an error :( -> ${err}`);
    });
}
function setChoreAssignment (newChoreAssignment, client) {

}
function rotateChoreAssignment (choreAssignment) {

}
function getChoreAssignments (client) {
  return client.query(`
    SELECT c.chore_id, c.assigned_to 
    FROM dev."Chores" c
  `);
}

function disconnectDb (client) {
  return client
    .end()
    .then(() => {
      console.log("Successfully disconnected from DB");
    });
}
