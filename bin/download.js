var fs       = require('fs')
  , path     = require('path')
  , tmp      = require('tmp')
  , download = require('download')
  , rimraf   = require('rimraf')
  , glob     = require('glob');

/**
 * Download, extract, and get the content of the subtitle file
 * 
 * @param  {String}  downloadLink
 * @return {Promise} resolve with {content: buffer, type: (srt, ass, sub)}
 */
function fetch(downloadLink) {

  return new Promise(function(resolve, reject) {

    var tmpDir = tmp.dirSync().name;
    
    // Download and export the subtitle file
    download(downloadLink, tmpDir, {extract: true}).then(function() {

      // Get the subtitle file
      glob(path.join(tmpDir, '*.+(srt|ass|sub)'), {}, function(error, files) {

        // Something went wrong
        if (error) {
          rimraf.sync(tmpDir);
          return reject(error);
        }

        // Subtitle file not found
        if (!files.length) {
          rimraf.sync(tmpDir);
          return reject(new Error('Invalid subtitle file'));
        }

        resolve({
          // Read the subtitle file
          content: fs.readFileSync(files[0]),
          // Get the type of the subtitle file
          type: path.extname(files[0]).toLowerCase().substr(1)
        });

        // Cleanup
        rimraf.sync(tmpDir);

      });

    });

  });

}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  fetch: fetch
};
