var Mocha = require("mocha");
var fs = require("fs");
const { join } = require("path");
let current_excercise = 1;
let failed = false;

const test = (excercise) => {
  copyExcerciseText(excercise);
  console.log(`Testing excercise ${excercise}`);
  var mocha = new Mocha({});
  mocha.addFile(join(__dirname, `/x/${excercise}/test.js`));
  mocha.bail(true);

  mocha
    .run()
    .on("pass", function (test) {
      console.log(`Test passed: ${test.title}`);
    })
    .on("fail", function (test, err) {
      console.log("Test fail");
      fs.appendFileSync(join(project, "README.md"), "\n" + err.message)
      failed = true;
    })
    .on("end", function () {
      mocha.unloadFiles();
      mocha.dispose();
      const x = getNumberOfExcercises(join(__dirname, "/x"));
      if (failed) {
        console.log(`Excercise ${excercise} failed!`);
      } else if (excercise === x) {
        console.log("All tests passed! Congratulations!");
        copyFile(join(__dirname, "/x/bye.md"));
      } else {
        current_excercise++;
        test(current_excercise);
      }
    })
    .on("error", function (err) {
      console.log(err);
    })
;
};

var watch = require("node-watch");
const project = join(__dirname, "../incidents-app");

watch(project, { recursive: true, filter: f => !/README.md/.test(f) }, function (evt, name) {
  //run tests
  console.log("File changed: ", name);
  failed = false;
  test(current_excercise);
});

const copyExcerciseText = (excercise) => {
  copyFile(join(__dirname, `/x/${excercise}/task.md`));
}
const copyFile = (file) => {
  fs.copyFileSync(join(file), join(project, `README.md`));
}
test(current_excercise);
copyExcerciseText(current_excercise);

const getNumberOfExcercises = (source) => getDirectories(source).length;

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

