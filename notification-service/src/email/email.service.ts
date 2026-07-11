import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendBorrowSuccess(userId: number, bookId: number) {
    console.log('==============================');
    console.log('📧 Sending Email...');
    console.log(`User ${userId} borrowed Book ${bookId}`);
    console.log('Email sent successfully!');
    console.log('==============================');
  }
}
