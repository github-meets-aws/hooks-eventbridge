import {
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  SecretsManagerClient
} from '@aws-sdk/client-secrets-manager';

import { SecretPort } from '../ports';

export interface SecretProviderProps {
  readonly secretId: string;
}

export class SecretsManagerAdapter implements SecretPort<string> {
  private lastRetrievedSecret?: GetSecretValueCommandOutput;

  constructor(
    private readonly secretsManagerClient: SecretsManagerClient,
    private readonly props: SecretProviderProps
  ) {
  }

  async checkNewVersion(): Promise<boolean> {
    const newVersion = await this.secretsManagerClient.send(
      new GetSecretValueCommand({ SecretId: this.props.secretId })
    );

    if (newVersion.VersionId === this.lastRetrievedSecret?.VersionId)
      return false;

    this.lastRetrievedSecret = newVersion;
    return true;
  }

  async value(): Promise<string> {
    if (!this.lastRetrievedSecret)
      this.lastRetrievedSecret = await this.secretsManagerClient.send(
        new GetSecretValueCommand({ SecretId: this.props.secretId })
      );

    return this.lastRetrievedSecret.SecretString ?? '';
  }
}
