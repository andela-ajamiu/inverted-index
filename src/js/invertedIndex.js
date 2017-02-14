const invertedIndex = function () {
  this.indexedFiles = {};

  this.searchResults = {};

  this.wordsToArray = str => str.replace(/[.,\/#!$%\^&@\*?;:'{}=\-_`~()]/g, '').trim().toLowerCase().split(' ');

  this.removeDuplicates = arr => arr.filter((word, index) => arr.indexOf(word) === index);

  this.createIndex = (fileName, fileContents) => {
    try {
      // This will contain the indexed file contents
      const indexedFileContents = {
        indexMap: {}
      };

      /**
       * Gets index number of each document in the
       * JSON object
       */
      indexedFileContents.docIndexNum = fileContents.map((item, indexNum) => indexNum);

      fileContents.forEach((item, indexNum) => {
        let titleTokens;
        let textTokens;

        /**
         * Check if each document in the JSON file
         * has a title and text.
         */
        if (item.title && item.text) {
          // Tokenize both title and text
          titleTokens = this.tokenize(item.title);
          textTokens = this.tokenize(item.text);
        } else {
          throw new Error(`Document ${indexNum} should have text and title`);
        }


        // Merged array of both titleTokens and textTokens
        let tokens = titleTokens.concat(textTokens);

        // Get unique words from tokens
        tokens = this.uniqueWords(tokens);

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
      this.indexedFiles[fileName] = indexedFileContents;
    } catch (e) {
      const errorMsg = 'Invalid JSON file! Please ensure it is properly formatted and try again. Thank you';
      throw new Error(errorMsg);
    }
  };
};
