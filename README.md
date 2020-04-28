# Cypress-Page-object-model-dummy-project
A testing framework - To test the UI component 

```You can save generated videos and screenshots as CircleCI artifacts```

steps:
  - checkout
  - run:
      name: Running E2E tests
      command: cypress run
  - store_artifacts:
      path: cypress/videos
  - store_artifacts:
      path: cypress/screenshots
Test summary
Generate just XML report
CircleCI can store test results from a large number of test reporters. Cypress can output test results with custom reporters, including using built-in junit format. Just add the following options to the CI command to generate and store test results.

- run:
    name: Running E2E tests
    command: cypress run --reporter junit --reporter-options "mochaFile=results/my-test-output.xml"
- store_test_results:
    path: results
The generated file will be placed in folder results and the folder will be uploaded to CircleCI storage. This summary will be really helpful when a test fails. For example, I have introduced a different label into the test, the word testing never appears on the page, yet the test is looking for it.

// a-spec.js
it('has h2', () => {
  cy.contains('h2', 'testing')
})

The CircleCI test summary shows failed test and user-friendly message.

Failed test message

Switching to the artifacts tab, we can find the screenshot PNG image taken at the failure moment.

Failed test artifact

Finally, we can open either the video, or the screenshot artifact

Failed to find "testing" H2 element

The failure is now easy to see and fix.

In this repository take a look at test-junit script inside package.json

Spec + XML reports
You can generate XML junit report and see spec output while CI is running using mocha-multi-reporters.

npm install --save-dev mocha mocha-multi-reporters mocha-junit-reporter
cypress run --reporter mocha-multi-reporters --reporter-options configFile=config.json
File config.json has

{
  "reporterEnabled": "spec, mocha-junit-reporter",
  "mochaJunitReporterReporterOptions": {
    "mochaFile": "multiple-results/results.xml"
  }
}
The standard output will have spec names during the test run, and the final result will be saved in JUnit XML format in file multiple-results/results.xml.

Take a look at test-multiple script inside package.json for example.


