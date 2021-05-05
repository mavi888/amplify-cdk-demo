import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as path from 'path';

export class AmplifyInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myLambda = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
    });

    const myAPIGateway = new apigw.RestApi(this, "hello-api", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: ['*'],
      }
    });
    myAPIGateway.root
      .resourceForPath("hello")
      .addMethod("GET", new apigw.LambdaIntegration(myLambda));

    const amplifyApp = new amplify.App(this, "amplify-demo-app", {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "YOUR_OWN",
        repository: "amplify-application-demo",
        oauthToken: cdk.SecretValue.secretsManager('github-token')
      }),
      environmentVariables: {
        'ENDPOINT': myAPIGateway.url,
        'REGION': this.region
      }
    });

    const masterBranch = amplifyApp.addBranch("main");

    
  }
}
