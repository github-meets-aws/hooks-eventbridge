import { Construct } from "constructs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ISecret, Secret } from "aws-cdk-lib/aws-secretsmanager";

export interface WebhookProps {
  secretArn?: string;
}

export class Webhook extends Construct {
  protected secret: ISecret;

  constructor(scope: Construct, id: string, props: WebhookProps) {
    super(scope, id);

    if (props.secretArn)
      this.secret = Secret.fromSecretCompleteArn(this, "secret", props.secretArn);
    else
      this.secret = new Secret(this, "secret");

    const handler = new NodejsFunction(this, "handler", {
      environment: {
        GITHUB_SECRET_ARN: this.secret.secretFullArn!
      }
    });

    new LambdaRestApi(this, "api", { handler });
  }
}
