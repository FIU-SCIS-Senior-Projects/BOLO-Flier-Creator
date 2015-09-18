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


## How to use

Not much here yet.  Stay tuned!


## Development Notes

### Secrets
In order for the application to run on a local machine your development
environment needs to have specific Cloudant credentials set. All you need to
do is save a file named .env in your project root with the needed environment
variables set. Check the .env.example file to see the format and variables
used in this project.  **Do not edit the .env.example file and/or commit it.**