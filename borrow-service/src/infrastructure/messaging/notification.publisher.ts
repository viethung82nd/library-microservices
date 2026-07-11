import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BorrowCreatedEvent } from '../../domain/events/borrow-created.event';

@Injectable()
export class NotificationPublisher {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  publishBorrowCreated(event: BorrowCreatedEvent) {
    this.client.emit('borrow.created', event);
  }
}
