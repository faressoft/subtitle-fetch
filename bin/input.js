var inquirer = require('inquirer')
  , lodash   = require('lodash')
  , chalk    = require('chalk')
  , fuzzy    = require('fuzzy');

// Activate AutoComplete plugin
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/**
 * Prompt the user to enter the movie name
 * 
 * @param  {String}  defaultMovieName the default value
 * @return {Promise}
 */
function askForMovieName(defaultMovieName) {

  return inquirer.prompt([{
    type: 'input',
    name: 'name',
    default: defaultMovieName,
    message: 'Enter the movie name'
  }]).then(function(answers) {

    return answers['name'];

  });
  
}

/**
 * Prompt the user to select a search result
 * 
 * @param  {Array}   searchResults [{link, title}, ..]
 * @return {Promise} resolve with the selected link
 */
function chooseSearchResult(searchResults) {

  // Search results indexed by titles
  var searchResultsByTitle = lodash.keyBy(searchResults, 'title');

  // List of search results titles
  var titles = Object.keys(searchResultsByTitle);

  return inquirer.prompt([{
    type: 'autocomplete',
    name: 'searchResult',
    message: 'Select a search result',
    pageSize: 10,
    source: function(answersSoFar, input) {

      input = input || '';

      return new Promise(function(resolve) {

        var fuzzyResult = fuzzy.filter(input, titles);

        var data = fuzzyResult.map(function(element) {
          return element.original;
        });

        resolve(data);
        
      });

    }
  }]).then(function(answers) {

    return searchResultsByTitle[answers.searchResult].link;

  });
  
}

/**
 * Prompt the user to select a language
 * 
 * @param  {Array}   languages
 * @return {Promise}
 */
function chooseLanguage(languages) {

  return inquirer.prompt([{
    type: 'autocomplete',
    name: 'language',
    message: 'Select a language',
    pageSize: 10,
    source: function(answersSoFar, input) {

      input = input || '';

      return new Promise(function(resolve) {

        var fuzzyResult = fuzzy.filter(input, languages);

        var data = fuzzyResult.map(function(element) {
          return element.original;
        });

        resolve(data);
        
      });

    }
  }]).then(function(answers) {

    return answers.language;

  });

}

/**
 * Prompt the user to select a language then to choose a subtitle
 * 
 * @param  {Array}   subtitlesList {language: [{link, title, ownerName, rating(neutral|positive|bad)}], ..}
 * @return {Promise} resolve with the selected link
 */
function chooseSubtitle(subtitlesList) {

  return chooseLanguage(Object.keys(subtitlesList)).then(function(selectedLanguage) {

    // The subtitles list for the selected language
    var languageSubtitlesList = subtitlesList[selectedLanguage];

    // Lanaguge subtitles list indexed by titles
    var languageSubtitlesListByTitle = lodash.keyBy(languageSubtitlesList, 'title');

    // List of language subtitles titles
    var titles = Object.keys(languageSubtitlesListByTitle);

    return inquirer.prompt([{
      type: 'autocomplete',
      name: 'subtitle',
      message: 'Select a subtitle',
      pageSize: 10,
      source: function(answersSoFar, input) {

        input = input || '';

        return new Promise(function(resolve) {

          var fuzzyResult = fuzzy.filter(input, titles);

          var data = fuzzyResult.map(function(element) {

            var title = element.original;
            var ownerName = chalk.gray('[' + languageSubtitlesListByTitle[title].ownerName + ']');
            var ratingFlag = null;

            // Rating flag
            if (languageSubtitlesListByTitle[title].rating === 'neutral') {
              ratingFlag = chalk.gray('[~]');
            } else if (languageSubtitlesListByTitle[title].rating === 'positive') {
              ratingFlag = chalk.green('[#]');
            } else if (languageSubtitlesListByTitle[title].rating === 'bad') {
              ratingFlag = chalk.red('[X]');
            }

            return {
              name: ratingFlag + ' ' + element.original + ' ' + ownerName,
              value: element.original,
            }

          });

          resolve(data);
          
        });

      }
    }]).then(function(answers) {

      return languageSubtitlesListByTitle[answers.subtitle].link;

    });
    
  });
  
}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  askForMovieName: askForMovieName,
  chooseSearchResult: chooseSearchResult,
  chooseSubtitle: chooseSubtitle
};
