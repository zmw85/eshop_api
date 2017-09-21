const importTest = (name, path) => {
  describe(name, function () {
    require(path);
  });
}

// const common = require("./common");

describe("API /", function () {
  // beforeEach(function () {
  //    console.log("running something before each test");
  // });
  importTest("/auth", './auth/token');
  importTest("/api", './api/user');
  // after(function () {
  //     console.log("after all tests");
  // });
});