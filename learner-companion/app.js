var Mocha = require("mocha");
var fs = require("fs");
const { join } = require("path");
let current_exercise = 1;
let failed = false;

const test = (exercise) => {
  copyExerciseText(exercise);
  console.log(`Testing exercise ${exercise}`);
  var mocha = new Mocha({});
  mocha.addFile(join(__dirname, `/x/${exercise}/test.js`));
  mocha.bail(true);
  //mocha.reporter('markdown', { output: 'mocha.md' });

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
      const x = getNumberOfExercises(join(__dirname, "/x"));
      if (failed) {
        console.log(`Exercise ${exercise} failed!`);
      } else if (exercise === x) {
        console.log("All tests passed! Congratulations!");
        copyFile(join(__dirname, "/x/bye.md"));
      } else {
        current_exercise++;
        test(current_exercise);
      }
    })
    .on("error", function (err) {
      console.log("Mocha Error");
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
  test(current_exercise);
});

const copyExerciseText = (exercise) => {
  copyFile(join(__dirname, `/x/${exercise}/task.md`));
}
const copyFile = (file) => {
  fs.copyFileSync(file, join(project, `README.md`));
}
test(current_exercise);
copyExerciseText(current_exercise);

const getNumberOfExercises = (source) => getDirectories(source).length;

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

