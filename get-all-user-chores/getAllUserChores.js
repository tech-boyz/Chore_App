// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
//let response;
//const url = require()
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

exports.lambdaHandler = async(event) => {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DBNAME 
    });
    client
      .connect()
      .then((response) => {
        console.log("connected");
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
    
    return new Promise(
      (resolve, reject) => client
      .query(`
        SELECT u.first_name, u.last_name, c.chore_name
        FROM public."Users" u INNER JOIN public."User_Chore" uc ON u.user_id=uc.user_id
        INNER JOIN public."Chores" c ON uc.chore_id=c.chore_id;
      `)
      .then((res) => resolve(res.rows))
      .catch((err) => reject(Error(err)))
      .then(() => client.end())
      );
};

