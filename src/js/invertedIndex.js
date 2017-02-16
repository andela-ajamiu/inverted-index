module.exports = function () {
  this.searchResults = {};

  this.wordsToArray = str => str.replace(/[.,/#!$%^&@*?;:'{}=\-_`~()]/g, '').trim().toLowerCase().split(' ');

  this.removeDuplicates = arr => arr.filter((word, index) => arr.indexOf(word) === index);

  this.createIndex = (files) => {
    this.localIndexedFiles = {};
    try {
      // This will contain the indexed file contents


      /**
       * Gets index number of each document in the
       * JSON object
       */
      files.forEach((file) => {
        const fileName = file.name;
        const fileContents = file.docs;

        const indexedFileContents = {
          indexMap: {}
        };

        indexedFileContents.docIndexNum = fileContents.map((item, indexNum) => indexNum);

        fileContents.forEach((item, indexNum) => {
          let titleTokens;
          let textTokens;

          /**
           * Check if each document in the JSON file
           * has a title and text.
           */
          if (item.title && item.text) {
            // wordsToArray both title and text
            titleTokens = this.wordsToArray(item.title);
            textTokens = this.wordsToArray(item.text);
          } else {
            throw new Error(`Document ${indexNum} should have text and title`);
          }


          // Merged array of both titleTokens and textTokens
          let tokens = titleTokens.concat(textTokens);

          // Get unique words from tokens
          tokens = this.removeDuplicates(tokens);

          /** Set each token as a property indexMap of indexedFileContents with an array value
           * of the index number of the current document where it appears.
           */
          tokens.forEach((token) => {
            if (!indexedFileContents.indexMap.hasOwnProperty(token)) {
              indexedFileContents.indexMap[token] = [indexNum];
            } else {
              indexedFileContents.indexMap[token].push(indexNum);
            }
          });
        });

        // Update the indexed files records
        this.localIndexedFiles[fileName] = indexedFileContents;
      });
    } catch (e) {
      const errorMsg = 'Invalid JSON file! Please ensure it is properly formatted and try again. Thank you';
      throw new Error(errorMsg);
    }
  };

  this.searchFile = (fileName, searchQuery) => {
    if (this.localIndexedFiles[fileName]) {
      searchQuery = this.wordsToArray(searchQuery);
      searchQuery = this.removeDuplicates(searchQuery);

      this.searchResults[fileName] = {
        indexMap: {},
        docIndexNum: this.localIndexedFiles[fileName].docIndexNum
      };

      searchQuery.forEach((query) => {
        if (this.localIndexedFiles[fileName].indexMap[query]) {
          this.searchResults[fileName].indexMap[query] = this.localIndexedFiles[fileName].indexMap[query];
        } else {
          this.searchResults[fileName].indexMap[query] = [];
        }
      });
    }
  };

  this.searchIndex = (fileName, searchQuery) => {
    if (Object.keys(this.localIndexedFiles).indexOf(fileName) !== -1) {
      this.searchFile(fileName, searchQuery);
    } else {
      Object.keys(this.localIndexedFiles).forEach((file) => {
        this.searchFile(file, searchQuery);
      });
    }
  };
};


// module.exports = invertedIndex;
