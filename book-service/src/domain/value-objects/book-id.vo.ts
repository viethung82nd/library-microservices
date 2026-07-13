export class BookId {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error('Book id is required');
    }
  }

  getValue() {
    return this.value;
  }

  equals(other: BookId) {
    return this.value === other.value;
  }
}
