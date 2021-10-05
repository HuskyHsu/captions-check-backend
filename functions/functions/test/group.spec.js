const admin = require("firebase-admin");
const chai = require("chai");
const request = require("supertest");

const test = require("firebase-functions-test")();
const assert = chai.assert;
const myFunctions = require("../index");

describe("Cloud Functions - Group", () => {
  let app, token;
  before(async function () {
    this.timeout(30000);
    const wrapped = test.wrap(myFunctions.createUser);

    const uid = `${new Date().getTime()}`;
    const email = `user-${uid}@example.com`;
    const user = test.auth.makeUserRecord({
      providerData: [{ providerId: uid }],
      uid,
      email,
    });

    // Call the function
    await wrapped(user);
    token = await admin.auth().createCustomToken(uid);
  });

  before(() => {
    app = myFunctions.app;
  });

  after(() => {
    test.cleanup();
  });

  it("tests the Create Group feature", (done) => {
    request(app)
      .post("/groups")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        console.log(res.body);
        done();
      });
  }).timeout(30000);
});
