var glob = require('glob')
  , path = require('path')
  , fs   = require('fs')
  , ptn  = require('parse-torrent-name');

/**
 * Get Movie Name
 * 
 * - Get the first file that has one of the
 *   following extensions in the current directory
 *   mp4, mpg, avi, mov, mkv
 * - Parse the movie name
 * 
 * @return {Promise} resolve with the name, reject if no files matched
 */
function getMovieName() {

  return new Promise(function(resolve, reject) {

    glob('*.+(mp4|mpg|avi|mov|mkv)', {}, function (error, files) {

      // Something went wrong
      if (error) {
        return reject(error);
      }

      // No matched files
      if (!files.length) {
        return reject(new Error('No movies in the current directory (mp4, mpg, avi, mov, mkv)'));
      }

      // Parse the movie file name
      var parsedName = ptn(files[0]);

      // Format the movie name
      var movieName = parsedName.title;

      resolve(movieName);

    });
    
  });

}

/**
 * Save Subtitle
 *
 * - Get the first file that has one of the
 *   following extensions in the current directory
 *   mp4, mpg, avi, mov, mkv
 * - Save the subtitle to a file with a matching base name
 *
 * @param {String}   content
 * @param {String}   type (str, ass)
 * @return {Promise}
 */
function saveSubtitle(content, type) {

  return new Promise(function(resolve, reject) {

    glob('*.+(mp4|mpg|avi|mov|mkv)', {}, function (error, files) {

      // Something went wrong
      if (error) {
        return reject(error);
      }

      // No matched files
      if (!files.length) {
        return reject(new Error('No movies in the current directory (mp4, mpg, avi, mov, mkv)'));
      }

      // The name of the movie file without extension
      var movieName = path.parse(files[0]).name;

      // Save the subtitle file
      fs.writeFile(movieName + '.' + type, content, 'utf8', function(error) {

        // Something went wrong
        if (error) {
          return reject(error);
        }

        resolve();
        
      });

    });

  });

}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  getMovieName: getMovieName,
  saveSubtitle: saveSubtitle
};
