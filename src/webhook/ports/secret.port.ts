export interface SecretPort<T> {
  checkNewVersion(): Promise<boolean>;
  value(): Promise<T>;
}
