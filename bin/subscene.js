var request     = require('request')
  , cheerio     = require('cheerio')
  , lodash      = require('lodash')
  , querystring = require('querystring');

/**
 * Subscene's base url
 * @type {String}
 */
const BASE_URL = 'https://subscene.com';

/**
 * Search by a movie name
 * 
 * @param  {String}  query
 * @return {Promise} resolve with an array of {link, title}
 */
function search(query) {

  return new Promise(function(resolve, reject) {

    // To store the search results
    var results = [];
    
    // Escape the query
    query = querystring.escape(query);

    // Get the search page
    request.get(BASE_URL + '/subtitles/title?q=' + query, function (error, response, body) {

      // Something went wrong
      if (error) {
        return reject(error);
      }

      // Failed
      if (response.statusCode !== 200) {
        return reject(new Error('Search request is failed'));
      }

      // Parse the page
      var $ = cheerio.load(body);

      // Get the results
      $('.search-result > ul > li > .title > a').each(function() {

        results.push({
          // Absolute link
          link: BASE_URL + $(this).attr('href'),
          // The title of the result
          title: lodash.trim($(this).text())
        });

      });

      resolve(results);

    });

  });

}

/**
 * Parse a subtitles list page
 * 
 * @param  {String}  link
 * @return {Promise} resolve with and object indexed by languages such that
 *                   each language contains an array of {link, title, ownerName, rating(neutral|positive|bad)}
 */
function list(link) {

  return new Promise(function(resolve, reject) {

    // To store the list results indexed by languages
    var results = {};
 
    // Get the search page
    request.get(link, function (error, response, body) {

      // Something went wrong
      if (error) {
        return reject(error);
      }

      // Failed
      if (response.statusCode !== 200) {
        return reject(new Error('List request is failed'));
      }

      // Parse the page
      var $ = cheerio.load(body);

      // Get the results
      $('#content .content table tbody tr').each(function() {

        var result = $(this).find('.a1 a');
        var language = lodash.trim(result.find('span').eq(0).text());

        // Language not recognized
        if (!language) {
          return;
        }

        // The language is not added to the results yet
        if (typeof results[language] === 'undefined') {
          results[language] = [];
        }

        results[language].push({
          // Absolute link
          link: BASE_URL + result.attr('href'),
          // The title of the result
          title: lodash.trim(result.find('span').eq(1).text()),
          // The name of the person who published the subtitle
          ownerName: lodash.trim($(this).find('.a5').text()),
          // neutral, positive, bad
          rating: result.find('span').eq(0).attr('class').match(/\w+(?=-icon)/)[0]
        });

      });

      resolve(results);

    });

  });

}

/**
 * Parse a subtitle page and get the download absolute link
 * 
 * @param  {String}  link
 * @return {Promise}
 */
function getDownloadLink(link) {

  return new Promise(function(resolve, reject) {

    // Get the search page
    request.get(link, function (error, response, body) {

      // Something went wrong
      if (error) {
        return reject(error);
      }

      // Failed
      if (response.statusCode !== 200) {
        return reject(new Error('Subtitle request is failed'));
      }

      // Parse the page
      var $ = cheerio.load(body);

      resolve(BASE_URL + $('.download a').attr('href'));

    });

  });

}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  search: search,
  list: list,
  getDownloadLink: getDownloadLink
};
