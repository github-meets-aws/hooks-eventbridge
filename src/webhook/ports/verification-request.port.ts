export interface VerificationRequestPort {
  readonly eventName: string;
  readonly payload: string;
  readonly signature: string;
}
