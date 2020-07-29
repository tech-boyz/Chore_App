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
// TODO: not very SOLID of me. Consider refactoring.
async function rotateChores (client) {
  return client
    .connect()
    .then(() => {
      console.log("Successfully connected to the DB!");
      return getChoreAssignments(client);
    })
    .then((choreAssignment) => {
      return exports.rotateChoreAssignment(choreAssignment);
    })
    .then((newChoreAssignment) => {
      return setChoreAssignment(newChoreAssignment, client);
    })
    .catch((err) => {
      disconnectDb(client);
      console.log(`There was an error :( -> ${err}`);
      return;
    })
    .then(() => {
      return disconnectDb(client);
    });
}
function setChoreAssignment (newChoreAssignment, client) {
  const updateQuery = getChoreUpdateQuery(newChoreAssignment);
  return client
    .query(updateQuery);
}

// TODO: offload dev/public to enviornment variable.
function getChoreUpdateQuery(newChoreAssignment){
  var updateQueryString = "";
  newChoreAssignment.forEach(assignment => {
    updateQueryString +=
      ` UPDATE dev."Chores" 
        SET assigned_to='${assignment.assigned_to}'
        WHERE chore_id='${assignment.chore_id}';
      `;
  }); 
  return updateQueryString;
}
// TODO: Discuss how to offload the method of rotation to configuration.
exports.rotateChoreAssignment = function rotateChoreAssignment (choreAssignment) {
  const choreAssignemntSize = choreAssignment.length;

  let newChoreAssignment = [{
    chore_id: choreAssignment[choreAssignemntSize - 1].chore_id,
    assigned_to: choreAssignment[0].assigned_to
  }];
  for(let i = 0; i < choreAssignemntSize - 1; i++)
    newChoreAssignment.push({
      chore_id: choreAssignment[i].chore_id,
      assigned_to: choreAssignment[i+1].assigned_to
    });
  return newChoreAssignment;
};

function getChoreAssignments (client) {
  return client.query(`
    SELECT c.chore_id, c.assigned_to 
    FROM dev."Chores" c
    `)
    .then( (res) => {
      return res.rows;
    });
}

function disconnectDb (client) {
  return client
    .end()
    .then(() => {
      console.log("Successfully disconnected from DB");
    });
}
