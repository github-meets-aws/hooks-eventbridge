export interface EventProps {
  readonly name: string;
  readonly payload: string;
}

export interface EventEmitterPort {
  emit(event: EventProps): Promise<void>;
}
