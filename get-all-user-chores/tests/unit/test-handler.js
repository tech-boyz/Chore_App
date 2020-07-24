'use strict';

const app = require('../../getAllUserChores.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const sucessfulClient = {
            query: (str) => {
                return new Promise((resolve)=> {
                    resolve({
                        rows: [{}]
                    });
                });
            },
            connect: () => {
                return new Promise((resolve) => {
                    resolve({});
                })
            },
            end: () => {
                return new Promise((resolve) => {
                    resolve({});
                });
            }
        };
        const queryResponse = await app.getAllUserChores(sucessfulClient);

        expect(queryResponse).to.be.an('object');
        expect(queryResponse.statusCode).to.equal(200);
        expect(queryResponse.body).to.be.an('array');

        let response = JSON.stringify(queryResponse.body);

        expect(response).to.be.an('string');
    });
    it('verifies correct handling of unsucessfull connect', async () => {
        const failedConnectClient = {
            query: (str) => {
                return new Promise((resolve)=> {
                    resolve({
                        rows: [{}]
                    });
                });
            },
            connect: () => {
                return new Promise((resolve, reject) => {
                    reject();
                })
            },
            end: () => {
                return new Promise((resolve, reject) => {
                    resolve({});
                });
            }
        };
        const queryResponse = await app.getAllUserChores(failedConnectClient);

        expect(queryResponse).to.be.an('object');
        expect(queryResponse).to.equal(app.failureResponse);

    });
    it('verifies sucessfull handling of unsucessful query', async () => {
        const failedQueryClient = {
            query: (str) => {
                return new Promise((resolve, reject)=> {
                    reject();
                });
            },
            connect: () => {
                return new Promise((resolve, reject) => {
                    resolve({});
                })
            },
            end: () => {
                return new Promise((resolve, reject) => {
                    resolve({});
                });
            }
        };
        const queryResponse = await app.getAllUserChores(failedQueryClient);

        expect(queryResponse).to.be.an('object');
        expect(queryResponse).to.equal(app.failureResponse);

    });
    it('verifies sucessful handling of unsucessful disconnect', async () => {
        const failedDisconnectClient = {
            query: (str) => {
                return new Promise((resolve, reject)=> {
                    resolve({
                        rows: [{}]
                    });
                });
            },
            connect: () => {
                return new Promise((resolve, reject) => {
                    resolve({});
                })
            },
            end: () => {
                return new Promise((resolve, reject) => {
                    reject({stack: "haha u failed"});
                });
            }
        };
        const queryResponse = await app.getAllUserChores(failedDisconnectClient);

        expect(queryResponse).to.be.an('object');
        expect(queryResponse).to.equal(app.failureResponse);
    });
});
