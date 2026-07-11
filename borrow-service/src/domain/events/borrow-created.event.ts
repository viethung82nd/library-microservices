export class BorrowCreatedEvent {
  constructor(
    public readonly borrowId: string,
    public readonly userId: string,
    public readonly bookId: string,
    public readonly borrowedAt: Date,
  ) {}
}
