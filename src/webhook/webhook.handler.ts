import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Logger } from '@aws-sdk/types';

import { APIGatewayAdapter, EventBridgeAdapter, OctokitWebhooksAdapter, SecretsManagerAdapter } from './adapters';
import { EventEmitterPort, SecretPort, VerificationPort, VerificationRequestPort } from './ports';

const logger: Logger = console;

const secretId = process.env.GITHUB_SECRET_ARN;
if (!secretId || secretId === '') {
  logger.error(new Error('You need to specify GitHub Secret ARN!'));
  process.exit(1);
}

const eventEmitterPort: EventEmitterPort = new EventBridgeAdapter(new EventBridgeClient({ logger }), {
  eventBusName: process.env.EVENT_BUS_NAME,
  eventsSource: 'GitHub',
});
const secretPort: SecretPort<string> = new SecretsManagerAdapter(new SecretsManagerClient({ logger }), { secretId });
const verificationPort: VerificationPort = new OctokitWebhooksAdapter(secretPort);

export const handler: APIGatewayProxyHandlerV2 = async function (event) {
  let verificationRequest: VerificationRequestPort;

  try {
    verificationRequest = new APIGatewayAdapter(event);
  } catch (e) {
    logger.error(e as Error);
    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid Webhook Request' }) };
  }

  try {
    if (!(await verificationPort.verify(verificationRequest))) {
      logger.info(new Error('Invalid Signature Received'));
      return { statusCode: 403, body: JSON.stringify({ message: 'Invalid Signature' }) };
    }

    await eventEmitterPort.emit({ name: verificationRequest.eventName, payload: verificationRequest.payload });
  } catch (e) {
    logger.error(e as Error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Server Error' }) };
  }

  return { statusCode: 200 };
};
