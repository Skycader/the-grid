const f = require("./task66.js");

const errors = {
  username: ["should be valid", "should contain letters"],
  password: ["should be hard"],
};

const answer = [
  "username should be valid",
  "username should contain letters",
  "password should be hard",
];

describe("Erors task test", () => {
  it("should work fine", () => {
    expect(f(errors)).toEqual(answer);
  });
});
