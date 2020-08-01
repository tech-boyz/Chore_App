/* eslint-disable no-unused-vars */
"use strict";

const app = require("../../getAllUserChores.js");
const chai = require("chai");
const mocha = require("mocha");
const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;

console.log = function() {};

describe("Tests index", function () {
  it("verifies lambda handler", async() => {
    let event = {};
    let response = await app.lambdaHandler(event);
    expect(response.statusCode).to.equal(500);
  });
  it("verifies successful response", async () => {
    const sucessfulClient = {
      query: (str) => {
        return new Promise((resolve) => {
          resolve({
            rows: [{}]
          });
        });
      },
      connect: () => {
        return new Promise((resolve) => {
          resolve({});
        });
      },
      end: () => {
        return new Promise((resolve) => {
          resolve({});
        });
      }
    };
    const queryResponse = await app.getAllUserChores(sucessfulClient);

    expect(queryResponse).to.be.an("object");
    expect(queryResponse.statusCode).to.equal(200);
    expect(queryResponse.body).to.be.an("array");

    const response = JSON.stringify(queryResponse.body);

    expect(response).to.be.an("string");
  });
  it("verifies correct handling of unsucessfull connect", async () => {
    const failedConnectClient = {
      query: (str) => {
        return new Promise((resolve) => {
          resolve({
            rows: [{}]
          });
        });
      },
      connect: () => {
        return new Promise((resolve, reject) => {
          reject(Error("haha you failed"));
        });
      },
      end: () => {
        return new Promise((resolve, reject) => {
          resolve({});
        });
      }
    };
    const queryResponse = await app.getAllUserChores(failedConnectClient);

    expect(queryResponse).to.be.an("object");
    expect(queryResponse).to.equal(app.failureResponse);
  });
  it("verifies sucessfull handling of unsucessful query", async () => {
    const failedQueryClient = {
      query: (str) => {
        return new Promise((resolve, reject) => {
          reject(new Error("haha you failed."));
        });
      },
      connect: () => {
        return new Promise((resolve, reject) => {
          resolve({});
        });
      },
      end: () => {
        return new Promise((resolve, reject) => {
          resolve({});
        });
      }
    };
    const queryResponse = await app.getAllUserChores(failedQueryClient);

    expect(queryResponse).to.be.an("object");
    expect(queryResponse).to.equal(app.failureResponse);
  });
  it("verifies sucessful handling of unsucessful disconnect", async () => {
    const failedDisconnectClient = {
      query: (str) => {
        return new Promise((resolve, reject) => {
          resolve({
            rows: [{}]
          });
        });
      },
      connect: () => {
        return new Promise((resolve, reject) => {
          resolve({});
        });
      },
      end: () => {
        return new Promise((resolve, reject) => {
          reject(new Error("haha u failed"));
        });
      }
    };
    const queryResponse = await app.getAllUserChores(failedDisconnectClient);

    expect(queryResponse).to.be.an("object");
    expect(queryResponse).to.equal(app.failureResponse);
  });
});
