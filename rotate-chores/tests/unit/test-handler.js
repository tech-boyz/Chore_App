"use strict";

const app = require("../../rotateChores.js");
const chai = require("chai");
const mocha = require("mocha");
const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;

describe("Tests index", function () {
  it("verifies correct rotation", async () => {
    const previousChores = [ 
      { chore_id: "d9024d40-b0b6-4568-8c0f-db6b1b0b7acb",
        assigned_to: "218e5cc2-fd30-4118-8107-a7713be9de95" },
      { chore_id: "7bb527b9-28b5-4f0b-b8d7-8e15e80d08f8",
        assigned_to: "685c1996-84a8-45d1-ae3b-36294c575722" },
      { chore_id: "61cb6705-ca12-4754-841e-412610d16820",
        assigned_to: "abd94983-355d-4ac4-9cb7-8d33d33369da" } ];
    const expectedUpdatedChores = [ 
      { chore_id: "61cb6705-ca12-4754-841e-412610d16820",
        assigned_to: "218e5cc2-fd30-4118-8107-a7713be9de95" },
      { chore_id: "d9024d40-b0b6-4568-8c0f-db6b1b0b7acb",
        assigned_to: "685c1996-84a8-45d1-ae3b-36294c575722" },
      { chore_id: "7bb527b9-28b5-4f0b-b8d7-8e15e80d08f8",
        assigned_to: "abd94983-355d-4ac4-9cb7-8d33d33369da" } ];

    const rotatedChores = app.rotateChoreAssignment(previousChores);
    expect(rotatedChores).to.be.an("array");
    expect(rotatedChores).to.have.deep.members(expectedUpdatedChores);

  });

});
