# BOLO Flier Creator Version 3

This project is the third iteration of the BOLO Flier Creator application
concepted by the Pinecrest Police Department in Miami, Florida.  The third
version aims to re-engineer the application for security and scalability
through the use of newer technologies both in hardware and software.

The current application stack consists of:

- [Node.js](http://nodejs.org)
- [Express](http://expressjs.com)
- [IBM Bluemix PaaS](http://www.ibm.com/cloud-computing/bluemix)
- [Cloudant](http://cloudant.com)
- [SendGrid](https://sendgrid.com/)


## How to use

This app is designed to be used in a Node.js environment. Version 3 of the BOLO
Flier Creator is designed to be used in conjunction with the Bluemix PaaS and
CloudFoundry.

### Using on Bluemix with CloudFoundry

**tl;dr** Add the Cloudant service to your Bluemix, create a manifest.yml file,
connect your CloudFoundry CLI to the Bluemix API, push your app via the `cf
push` command.

**Steps**

1. Add the Cloudant service to your Bluemix account:
    * Reference the [Bluemix Cloudant
      docs](https://cloudant.com/cloudant-ibm-bluemix-tutorials-and-demos/) for
      detailed instruction.
2. Create a `manifest.yml` file using the included manifest.yml.sample file in
   the project.
    * Make sure to remove the `.sample` extension from the filename.
    * Using the sample with IBM Bluemix, the only keys that should need to be
      changed are `sevices`, `host`, and `name`.
3. Connect your CloudFoundry CLI to the Bluemix API.
    * Reference the [Bluemix CF CLI
      docs](https://www.ng.bluemix.net/docs/starters/install_cli.html) for
      detailed instructions.
4. Push your app: `cf push`


## Development Notes

### Secrets
In order for the application to run on a local machine your development
environment needs to have specific Cloudant credentials set. All you need to
do is save a file named .env in your project root with the needed environment
variables set. Check the .env.example file to see the format and variables
used in this project.  **Do not edit the .env.example file and/or commit it.**


### Testing
This project is using the following libraries for testing:

* [Mocha Test Runner](https://mochajs.org/)
* [Chai Assertion Library](http://chaijs.com/)
* [Sinon.JS Test Double Library](http://sinonjs.org)
* [Mockery - Node.js require() Mocking Library](https://github.com/mfncooper/mockery)

The project is set up for an effective BDD/TDD workflow. Tests are contained
in the test/ directory which contain directories for unit, functional, and
acceptance tests.

To execute Functional and Unit tests with coverage reports:  
`npm test`

Coverage reports are stored in `./coverage` directory.

To run individual tests:  
`mocha test/unit` -or- `npm run unit-test`  
`mocha test/integration`

The --watch flag can be used to watch for any changes to tests during
development:  
`mocha --watch test/unit`  
`mocha --watch test/integration`

Note that acceptance tests have not been implemented yet. The project plans
to use WebDriver for accpetance tests against user story scenarios. Changes
to these plans will be noted as needed.


## Documentation

The project requires all source code to be documented using
[JSDoc](http://usejsdoc.org) in order to generate documentation.

### Generating Documentation
Generating the documentation is easy! Make sure that JSDoc is installed by
using the `npm install` command. Then type `npm run docs` and that's it.
Open jsdoc/index.html file in your browser to read. Enjoy.


## References

### Bluemix Guides and References

[Design, manage, and test multi-instance Bluemix
applications](http://www.ibm.com/developerworks/cloud/library/cl-develop-scalable-bluemix-app/)
- The application's session handling strategy needs to be refactored. Currently
  is is storing sessions in-memory which can cause a Bluemix instance to crash
  when too many sessions are stored. This guide talks about session handling via
  key-value stores like Redis and CouchDB (Cloudant) in the context of
  multi-instance applications.
