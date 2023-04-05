# AWS Project
- AwS DynamoDB
- AWS Lambda
- AWS Cognito
- AWS EventBridge
- AWS SNS
- AWS SQS
- AWS API gateway
## How to Start
### First you need to deploy lambda Layer   
    $ cd services/Layer
    $ sls deploy
### Second 
    $ npm install
    $ cd services/BoardProject
    $ sls deploy
### Third
#### If you want swagger file
    $ serverless downloadDocumentation --outputFileName=filename.ext.