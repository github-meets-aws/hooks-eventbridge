import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { EventEmitterPort, EventProps } from '../ports';

interface EventBridgeAdapterProps {
  readonly eventsSource: string;
  readonly eventBusName?: string;
}

export class EventBridgeAdapter implements EventEmitterPort {
  constructor(private readonly eventBridgeClient: EventBridgeClient, private readonly props: EventBridgeAdapterProps) {
  }

  async emit(event: EventProps) {
    await this.eventBridgeClient.send(new PutEventsCommand({
      Entries: [
        {
          Detail: event.payload,
          DetailType: event.name,
          Source: this.props.eventsSource,
          EventBusName: this.props.eventBusName
          // Resources: TODO: Determine stacks to be deployed, etc. in a consistent way
          // TraceHeader: TODO: Add support for X-Ray
        }
      ]
    }));
  }
}
