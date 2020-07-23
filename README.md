# Chore_App
This is an application intended to keep track of and remind roomates/family members of their chores.

This is built and run using AWS's SAM CLI. for more information, see [Information on sam CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

## Build Status:

![Build Status](https://codebuild.us-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiWGQwbysrZFE4Skg4T0diRVIwWktHTCtsZHdCNHhjOTFTQlRyaThGTFVuVjF1NDZuZ3ZJOWhEc0EyK05kajFUREFqV05jVjJtNlZTeGxkUDJFS1lhNVRBPSIsIml2UGFyYW1ldGVyU3BlYyI6ImNVWnpBOEIrRmdiZjZOUXMiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

## Development Workflow

Quick Info:

- All PRs to `develop` and `master` require 1 approver and a passing build.
- There should be no commits to master pushed. All changes should be submitted through a PR.
- The `develop` branch contains the full history of the source code. 
- Feature branches should be based on `develop`; use `git checkout -b myFeatureBranch develop`.
- Once your feature is complete please submit a PR to `develop`. The only direct commits to `develop` should be small (such as a bug fix).

## Deployment workflow

Quick Info:

- Three live environments, `Dev`, `Staging`, and `Production`
- `release-*` branches map to Non-Prod environments. 
- Once `develop` has amassed enough features and is stable enough, branch off to create a `release-*` branch. Whenever a branch with pattern `release-*` is created, a deployment will trigger to `Dev` and `Staging`.
- PRs to master should be tagged with the release number. Once a PR to `master` is approved/merged, a build will trigger and immediately after a deployment to `Production`. `master` should always reflect the code that is on the live, `Production` environment. 

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

Unincluded in this repository is information reguarrding nececary enviornment variables, such as the host, port, username, password, and database name of the postgress instance. This must be provided in a file env.json in order to sucessfully deploy.

To build and deploy the application for the first time, run the following in your shell:

```bash
sam build
sam deploy --parameter-overrides ParametersHere
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modified IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
Chore_App$ sam build
```

The SAM CLI installs dependencies defined in `get-all-user-chores/package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
Chore_App$ sam local invoke lamdaHandler --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
Chore_App$ sam local start-api
Chore_App$ curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

## Add a resource to your application
The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
Chore_App$ sam logs -n HelloWorldFunction --stack-name Chore_App --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Unit tests

Tests are defined in the `get-all-user-chores/tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run unit tests.

```bash
Chore_App$ cd hello-world
hello-world$ npm install
hello-world$ npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name Chore_App
```
