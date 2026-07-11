export class Book {
  constructor(
    public id: string | null,
    public title: string,
    public author: string,
    public available: boolean = true,
  ) {}

  borrow() {
    if (!this.available) {
      throw new Error('Book is already borrowed');
    }

    this.available = false;
  }

  returnBook() {
    this.available = true;
  }
}
