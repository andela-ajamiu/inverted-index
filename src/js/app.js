angular.module('invertedIndex', [])

  .directive('validateReadSetscope', () => ({
    restrict: 'A',
    require: 'ngModel',
    link(scope, element, attrs, ngModel) {
      const readers = {};
      let uploadedFiles;

      element.on('change', (event) => {
        uploadedFiles = event.target.files;
        const length = uploadedFiles.length;
        for (let i = 0; i < length; i++) {
          if (uploadedFiles[i].name.match(/\.json$/g)) {
            const reader = new FileReader();
            reader.readAsText(uploadedFiles[i]);
            readers[uploadedFiles[i].name] = reader;
          }
        }

        const results = [];
        for (const file in readers) {
          readers[file].onload = function (event) {
            const fileContents = event.target.result;
            results.push({
              name: file,
              docs: JSON.parse(fileContents)
            });
            ngModel.$setViewValue(results);
          };
        }


        // function arrayOfFiles() {
        //   const readersMap = Object.keys(readers).map((file) => {
        //     return new Promise((resolve, reject) => {
        //       readers[file].onload = function (event) {
        //         const fileContents = event.target.result;
        //         resolve({
        //           name: file,
        //           docs: JSON.parse(fileContents)
        //         });
        //       };
        //     });

        // arrayOfFiles().then(res => {
        //   console.log(res, 'got here...');
        //   ngModel.$setViewValue(res);
        // })


      });
    }
  }))

  .controller('invertedIndexController', ($scope) => {
    const index = new invertedIndex();

    $scope.createIndex = (files) => {
      index.createIndex(files);
      $scope.indexedFiles = index.localIndexedFiles;
    };

    $scope.searchIndex = (fileName, searchQuery) => {
      if (searchQuery === undefined) {
        return alert('Please enter a search query');
      }
      index.searchIndex(fileName, searchQuery);
      $scope.searchResults = index.searchResults;
    };
  });

