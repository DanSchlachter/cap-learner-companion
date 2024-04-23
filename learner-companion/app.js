const Mocha = require('mocha')
const fs = require('fs')
const { join } = require('path')
const watch = require('node-watch')
const readline = require('readline')
const SilentReporter = require('./silencedMocha')

const projectDir = join(__dirname, '../incidents-app')
const exercisesDir = join(__dirname, '/x')

let currentExercise = 1
let failed = false

// Add SIGINT event listener only if none exists
if (!process.listenerCount('SIGINT')) {
  process.on('SIGINT', () => {
    console.log('Received SIGINT signal, exiting...')
    process.exit(0)
  })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', input => {
  if (input.trim().toLowerCase() === 'hint') {
    console.log('You requested a hint!')
    // Add your hint logic here...
  }
})

const testExercise = exercise => {
  showExerciseText(exercise)
  console.log(`Testing exercise ${exercise}`)

  var mocha = new Mocha({
    reporter: SilentReporter
  })
  mocha.addFile(join(exercisesDir, `${exercise}/test.js`))
  mocha.bail(true)

  mocha
    .run()
    .on('pass', function (test) {
      console.log(`Test passed: ${test.title}`)
    })
    .on('fail', function (test, err) {
      console.log('Test fail')
      fs.appendFileSync(join(projectDir, 'README.md'), '\n' + err.message)
      failed = true
    })
    .on('end', function () {
      mocha.unloadFiles()
      mocha.dispose()
      const x = getNumberOfExercises(join(__dirname, '/x'))
      if (failed) {
        console.log(`Exercise ${exercise} failed!`)
      } else if (exercise === x) {
        console.log('All tests passed! Congratulations!')
        showFile(join(exercisesDir, '/bye.md'))
      } else {
        currentExercise++
        testExercise(currentExercise)
      }
    })
    .on('error', function (err) {
      console.log('Mocha Error')
      console.log(err)
    })
}

watch(projectDir, { recursive: true, filter: f => !/README.md/.test(f) }, function (evt, name) {
  //run tests
  console.log('File changed: ', name)
  failed = false
  testExercise(currentExercise)
})

const showExerciseText = exercise => {
  showFile(join(__dirname, `/x/${exercise}/task.md`))
}
const showFile = file => {
  fs.copyFileSync(file, join(projectDir, `README.md`))
}

testExercise(currentExercise)
showExerciseText(currentExercise)

const getNumberOfExercises = source => getDirectories(source).length

const getDirectories = source =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
