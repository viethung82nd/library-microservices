import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookClient {
  constructor(
    @Inject('BOOK_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async getBook(id: string) {
    return firstValueFrom(this.client.send('get_book', id));
  }

  async borrowBook(id: string) {
    return firstValueFrom(this.client.send('borrow_book', id));
  }
}
