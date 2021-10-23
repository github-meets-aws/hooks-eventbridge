export interface VerificationRequestPort {
  readonly eventName: string;
  readonly payload: string;
  readonly signature: string;
}

export interface VerificationPort {
  verify(data: VerificationRequestPort): Promise<boolean>;
}
