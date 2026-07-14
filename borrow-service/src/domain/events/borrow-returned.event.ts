export class BorrowReturnedEvent {
  constructor(
    public readonly borrowId: string,
    public readonly userId: string,
    public readonly bookId: string,
    public readonly returnedAt: Date,
  ) {}
}
