/** Instance of index Object */
// const index = new invertedIndex();

const iindex = require('../src/js/invertedIndex.js');

const index = new iindex();
// console.log(index);
/**
 * Mock JSON files for the test suites
 */
const books = [{ name: 'books.json', docs: [{ title: 'Alice in Wonderland', text: 'Alice falls into a rabbit hole and enters a world full of imagination.' }, { title: 'The Lord of the Rings: The Fellowship of the Ring.', text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.' }] }];

const facts = [{ name: 'facts.json', docs: [{ title: 'The world we live in', text: 'Simple, yet Complex...Easy, yet Hard...Sweet, Yet bitter...Interesting, yet annoying' }, { title: 'Who we are', text: 'We are nothing, but nothing in the hand of something' }] }];

const empty = [{}];

const wrong = [{
  t: 'title',
  d: 'desv'
}];


describe('Read book data', () => {
  it('should not be empty', () => {
    expect(facts).not.toBe(null);
    expect(books.length > 0).toBeTruthy();
  });

  it('Should throw an error if a json file is empty or badly formatted', () => {
    expect(() => {
      index.createIndex('empty.json', empty);
    }).toThrow(new Error('Invalid JSON file! Please ensure it is properly formatted and try again. Thank you'));
  });

  it('Should ensure that all docs have a title and text property', () => {
    expect(() => {
      index.createIndex('wrong.json', wrong);
    }).toThrow(new Error('Invalid JSON file! Please ensure it is properly formatted and try again. Thank you'));
  });
});


describe('Tokenize words', () => {
  const str = 'Hello world, @this is ALL...////';

  it('Should return and array of words passed to it', () => {
    expect(Array.isArray(index.wordsToArray(str))).toBeTruthy();
  });

  it('Should remove all special characters', () => {
    expect(index.wordsToArray(str)).toEqual(['hello', 'world', 'this', 'is', 'all']);
  });
});


describe('Get unique words in the Array', () => {
  const arr = ['hello', 'world', 'world', 'world', 'this', 'is', 'all', 'this', 'is', 'all'];

  it('Should return and array of words passed to it', () => {
    expect(Array.isArray(index.removeDuplicates(arr))).toBeTruthy();
  });

  it('Should remove all duplicate words', () => {
    expect(index.removeDuplicates(arr)).toEqual(['hello', 'world', 'this', 'is', 'all']);
  });
});


describe('Populate Index', () => {
  beforeEach(() => {
    index.createIndex(books);
  });

  it('should populate the index', () => {
    expect(index.localIndexedFiles['books.json'].indexMap.alice).toBeTruthy();
    expect(Array.isArray(index.localIndexedFiles['books.json'].indexMap.alice)).toBeTruthy();
  });

  it('should verify that index is created', () => {
    expect(index.localIndexedFiles['books.json'].indexMap.alice)
      .toEqual([0]);
  });

  it('should verify that keys are mapped to the correct docs', () => {
    expect(index.localIndexedFiles['books.json'].indexMap.of).toEqual([0, 1]);
  });

  it('should verify that documents indices are populated into docIndexNum', () => {
    expect(Array.isArray(index.localIndexedFiles['books.json'].docIndexNum)).toBeTruthy();
    expect(index.localIndexedFiles['books.json'].docIndexNum).not.toBe(null);
    expect(index.localIndexedFiles['books.json'].docIndexNum.length).toEqual(2);
  });
});


describe('Search index of a single JSON file', () => {
  beforeEach(() => {
    index.createIndex(books);
    index.createIndex(facts);
    index.searchFile('facts.json', 'we are of');
  });

  it('should return an array of indices of the documents', () => {
    expect(Array.isArray(index.searchResults['facts.json'].indexMap.we)).toBeTruthy();
    expect(index.searchResults['facts.json'].indexMap.we).toEqual([0, 1]);
    expect(index.searchResults['books.json']).toBeUndefined();
  });
});


describe('Search index', () => {
  it('should return an array of indices of the documents', () => {
    index.createIndex(books);
    index.searchIndex('books.json', 'alice in Wonderland');
    expect(index.searchResults['books.json'].indexMap.alice).toEqual([0]);
    expect(index.searchResults['books.json'].indexMap.in).toEqual([0]);
    expect(index.searchResults['books.json'].indexMap.wonderland).toEqual([0]);
  });

  it('should return an array of indices of the documents', () => {
    index.createIndex(facts);
    index.searchIndex('facts.json', 'alice in Wonderland');
    expect(index.searchResults['facts.json'].indexMap.alice).toEqual([]);
    expect(Array.isArray(index.searchResults['facts.json'].indexMap.alice)).toBeTruthy();
  });

  it('should return an array of indices of the documents', () => {
    index.createIndex(books, facts);
    index.searchIndex('all', 'alice in Wonderland');
    expect(index.searchResults['books.json'].indexMap.alice).toEqual([0]);
    expect(index.searchResults['books.json'].indexMap.in).toEqual([0]);
    expect(index.searchResults['books.json'].indexMap.wonderland).toEqual([0]);
    expect(index.searchResults['facts.json'].indexMap.alice).toEqual([]);
    expect(Array.isArray(index.searchResults['facts.json'].indexMap.alice)).toBeTruthy();
  });
});
