import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { APIGatewayAdapter } from './api-gateway.adapter';

describe('happy flow', () => {
  let adapter: APIGatewayAdapter;

  const action = 'test';
  const body = JSON.stringify({ action });
  const signature = 'signature';
  const headers = { 'X-Hub-Signature-256': signature };

  const testFn = () => (adapter = new APIGatewayAdapter({ body, headers } as unknown as APIGatewayProxyEventV2));

  test('should not throw', () => expect(testFn).not.toThrow());
  test('should correctly determine the payload', () => expect(adapter.payload).toBe(body));
  test('should correctly determine the signature', () => expect(adapter.signature).toBe(signature));
  test('should correctly determine the event name', () => expect(adapter.eventName).toBe(action));
});
