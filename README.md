# mapapp-api

This is a template repo for a serverless api, to be used with mapapp-db and mapapp-frontend to create a map-based application.

1. Change name, version, description and repository in package.json
    1. npm i


2. [Add instructions for installing serverless]


3. in resources folder, edit serverless.yml.
   1. change name of service
   1. Under 'resources', change the 'Name' property of the ApiGatewayRestApi resource to the name of the API you want to create.
   1. Under 'UserPool', change the UserPoolName to the name of the user pool you want to create.
   1. on the command line, run the command 'sls deploy --stage dev'.


4. [Instructions for how to set up the identity pool, auth & unauth roles and all the other goddamn fucking stuff that you have to do to get that shit working.]
   1. [Or, you know, figure out how to do it all automatically with serverless.]
   1. Ok basically.  Create the identity pool.  Set up Auth and unauth roles for it.
   Assign permissions to each of those IAM roles so that they can execute the API.
      Check them against mapapp's.  Make sure the user pool is connected as an authenticator for the identity pool.  Create an app client for the user pool.
      Copy all those id's and everything over to the config.js file.
      Grumble Grumble Gripe Gripe Snort.
   1. NOBODY SHOULD HAVE TO SPEND WEEKS FIGURING THIS SHIT OUT
   1. Also, you must create the groups in the user pool manually, and there should be a way to do this through serverless
   1. And then, create a fucking S3 bucket for hosting
   
5. In AWS, go to Systems manager -> Parameter Store.
   1. Create parameters for each of the parameters needed for the environment variables in main/serverless.yml.
      1. Use a string identifying your app in place of 'mapapp'.
      1. Use 'dev' in place of ${opt:stage}.
      1. Copy the DB variables from the .env file in your db repo (cloned from mapapp-db).
      1. [Include instructions for how to generate a mapquest API key]


6. In the 'main' folder, edit serverless.yml.
   1. change the service name.
   1. Under provider -> environment, change the instances of 'mapapp' to the string you used when creating the environment variables.
   1. on the command line, run the command 'sls deploy --stage dev'.


7. Edit constants.js.
   1. Change the appName to the name of your app.
