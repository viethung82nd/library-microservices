import { BookTitle } from '../value-objects/book-title.vo';
import { AuthorName } from '../value-objects/author-name.vo';
import { BookId } from '../value-objects/book-id.vo';

export class Book {
  constructor(
    public id: BookId | null,
    public title: BookTitle,
    public author: AuthorName,
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

  rename(title: BookTitle) {
    this.title = title;
  }

  changeAuthor(author: AuthorName) {
    this.author = author;
  }
}
