export class Book {
  constructor(
    public id: string | null,
    public title: string,
    public author: string,
    private _available: boolean = true,
  ) {}

  get available(): boolean {
    return this._available;
  }

  borrow() {
    if (!this._available) {
      throw new Error('Book is already borrowed');
    }

    this._available = false;
  }

  returnBook() {
    if (this._available) {
      throw new Error('Book is already available');
    }

    this._available = true;
  }

  rename(title: string) {
    this.title = title;
  }

  changeAuthor(author: string) {
    this.author = author;
  }
}
