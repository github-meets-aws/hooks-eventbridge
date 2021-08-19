import { verify } from '@octokit/webhooks-methods';

import { SecretPort, VerificationPort, VerificationRequestPort } from '../ports';

export class OctokitWebhooksAdapter implements VerificationPort {
  constructor(private readonly secretProvider: SecretPort<string>) {
  }

  async verify(data: VerificationRequestPort): Promise<boolean> {
    return await this._verify(data) ||
      (await this.secretProvider.checkNewVersion() && await this._verify(data));
  }

  private async _verify(data: VerificationRequestPort) {
    return verify(await this.secretProvider.value(), data.payload, data.signature);
  }
}
