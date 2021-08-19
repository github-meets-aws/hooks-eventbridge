import { VerificationRequestPort } from './';

export interface VerificationPort {
  verify(data: VerificationRequestPort): Promise<boolean>;
}
