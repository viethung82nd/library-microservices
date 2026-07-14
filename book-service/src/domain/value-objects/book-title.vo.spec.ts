import { BookTitle } from './book-title.vo';
import { describe, it, expect } from '@jest/globals';

describe('BookTitle Value Object', () => {
  it('should create a valid title', () => {
    const title = new BookTitle('Clean Code');

    expect(title.getValue()).toBe('Clean Code');
  });
  it('should trim whitespace', () => {
    const title = new BookTitle('   Clean Code   ');

    expect(title.getValue()).toBe('Clean Code');
  });

  it('should throw when title is empty', () => {
    expect(() => {
      new BookTitle('');
    }).toThrow('Book title is required');
  });

  it('should throw when title contains only spaces', () => {
    expect(() => {
      new BookTitle('      ');
    }).toThrow('Book title is required');
  });

  it('should throw when title is too long', () => {
    expect(() => {
      new BookTitle('A'.repeat(101));
    }).toThrow('Book title is too long');
  });

  it('should be equal when values are the same', () => {
    const title1 = new BookTitle('Clean Code');
    const title2 = new BookTitle('Clean Code');

    expect(title1.equals(title2)).toBe(true);
  });

  it('should not be equal when values are different', () => {
    const title1 = new BookTitle('Clean Code');
    const title2 = new BookTitle('Refactoring');

    expect(title1.equals(title2)).toBe(false);
  });
});
