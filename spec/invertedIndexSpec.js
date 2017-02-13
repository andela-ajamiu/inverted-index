/** Instance of index Object */
const index = new invertedIndex();

/**
 * Mock JSON files for the test suites
 */
const books = [{
  title: 'Alice in Wonderland alice',
  text: 'Alice Alice Alice Alice falls into a rabbit hole and enters a world full of imagination.'
},

{
  title: 'The Lord of the Rings: The Fellowship of the Ring.',
  text: 'An alice unusual alliance of man, elf, dwarf dwarf, wizard and hobbit seek to destroy a powerful ring.'
},

{
  title: 'King of kings',
  text: 'Jesus Christ is the King of kings and Lord of lords alice'
}
];


const files = [{
  title: 'Hello people',
  text: "We Know how people would love it if they're appreciated for everything they do"
},

{
  title: 'This is the begining',
  text: 'When the awesome project kicks off a lot amazing things will begin to unveil alice'
}
];


const empty = [{}];
const wrong = [{
  t: 'title',
  d: 'desv'
}];


describe('Read book data', () => {
  it('should not be empty', () => {
    expect(files).not.toBe(null);
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
