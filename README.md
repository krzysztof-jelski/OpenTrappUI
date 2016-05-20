[![Build Status](https://secure.travis-ci.org/Pragmatists/OpenTrappUI.png)](http://travis-ci.org/Pragmatists/OpenTrappUI)

OpenTrappUI
===========

Open Time Registration Application

## prerequisites

### Install NodeJS

[https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

### Install node modules (run in project directory)

1. `npm install -g grunt-cli # you might need root privileges` (only needed if you want to use `grunt` globally; if not
  you can use `./node_modules/.bin/grunt` instead)
2. `npm install`

### Run tests

`npm test` or `grunt`

### Run local server

`npm start` or `grunt server`

### Other available tasks

Run unit tests in 'single run' mode: `grunt karma:unit`

Run unit tests in 'continuous run' mode with 'autoWatch': `grunt karma:dev`

Re-generate worklog entry parser: `grunt exec:generate_parser`

Publish on Github on PROD: `grunt gh-pages:prod`

## Upgrade TODOs

- [x] break a whole app into modules
- [x] reflect changes in modules into tests (dirs too)
- [ ] encapsulate components
- [ ] remove $scope usages
- [x] use ui-router
- [ ] move templates to same places as their scripts
- [ ] break CSS into modules/components etc.
- [ ] turn on linting
- [x] break routing into specific places with routes
- [ ] clean TODOs in code
- [x] introduce states' controllers instead of controllers on views
- [ ] remember which type of report was chosen (on refresh)
