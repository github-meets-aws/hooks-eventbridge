import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { VerificationRequestPort } from '../ports';

export class APIGatewayAdapter implements VerificationRequestPort {
  readonly eventName: string;
  readonly payload: string;
  readonly signature: string;

  constructor(event: APIGatewayProxyEventV2) {
    if (!event.body) {
      throw new Error('No webhook payload received');
    }

    if (!event.headers['X-Hub-Signature-256']) {
      throw new Error('No signature header received');
    }

    this.payload = event.body;
    this.signature = event.headers['X-Hub-Signature-256'];

    const { action } = JSON.parse(this.payload);
    if (typeof action !== 'string') {
      throw new Error('Received invalid hook action');
    }

    this.eventName = action;
  }
}
