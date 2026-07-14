export class Borrow {
  constructor(
    public id: string | null,
    public readonly userId: string,
    public readonly bookId: string,
    public borrowedAt: Date,
    public returnedAt: Date | null = null,
  ) {}

  returnBook() {
    if (this.returnedAt) {
      throw new Error('Book already returned');
    }

    this.returnedAt = new Date();
  }
}
