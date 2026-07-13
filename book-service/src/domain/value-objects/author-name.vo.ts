export class AuthorName {
  constructor(private readonly value: string) {
    const author = value.trim();

    if (!author) {
      throw new Error('Author is required');
    }

    this.value = author;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: AuthorName): boolean {
    return this.value === other.value;
  }
}
