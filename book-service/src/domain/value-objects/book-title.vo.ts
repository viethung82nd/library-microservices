export class BookTitle {
  constructor(private readonly value: string) {
    const title = value.trim();

    if (!title) {
      throw new Error('Book title is required');
    }

    if (title.length > 100) {
      throw new Error('Book title is too long');
    }

    this.value = title;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BookTitle): boolean {
    return this.value === other.value;
  }
}
