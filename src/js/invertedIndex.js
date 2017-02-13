"use strict";

var invertedIndex = function () {
    this.indexedFiles = {}

    this.searchResults = {}

    this.wordsToArray = function(str) {
        return str.replace(/[.,\/#!$%\^&@\*?;:'{}=\-_`~()]/g, "").trim().toLowerCase().split(" ");
    }

    this.removeDuplicates = function (arr) {
        return arr.filter(function (word, index) {
            return arr.indexOf(word) === index
        })
    }

    this.createIndex = function() {
        
      try {
      // This will contain the indexed file contents
      var indexedFileContents = {
        indexMap: {}
      };

      /** 
       * Gets index number of each document in the 
       * JSON object
       */
      indexedFileContents.docIndexNum = fileContents.map(function (item, indexNum) {
        return indexNum;
      });

      fileContents.forEach(function (item, indexNum) {

        var titleTokens;
        var textTokens;

        /**
         * Check if each document in the JSON file
         * has a title and text.
         */
        if (item.title && item.text) {
          // Tokenize both title and text
          titleTokens = this.tokenize(item.title);
          textTokens = this.tokenize(item.text);
        } else {
          throw "Document " + indexNum + " should have text and title";
        }


        // Merged array of both titleTokens and textTokens
        var tokens = titleTokens.concat(textTokens);

        // Get unique words from tokens
        tokens = this.uniqueWords(tokens);

        /** Set each token as a property indexMap of indexedFileContents with an array value
         * of the index number of the current document where it appears.
         */
        tokens.forEach(function (token) {
          if (!indexedFileContents.indexMap.hasOwnProperty(token)) {
            indexedFileContents.indexMap[token] = [indexNum];
          } else {
            indexedFileContents.indexMap[token].push(indexNum);
          }
        });
      }.bind(this));

      // Update the indexed files records
      this.indexedFiles[fileName] = indexedFileContents;
    } catch (e) {
      var errorMsg = "Invalid JSON file! Please ensure it is properly formatted and try again. Thank you";
      throw new Error(errorMsg);
    }

  }
}