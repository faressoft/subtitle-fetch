var iconvLite = require('iconv-lite')
  , chardet   = require('chardet');

var fs = require('fs');

/**
 * Convert encoding to UTF-8
 *
 * @param  {Buffer} buffer
 * @return {String}
 */
function converToUTF8(buffer) {

  // Detect the encoding
  var detectedEncoding = chardet.detect(buffer);

  // Already UTF8
  if (!detectedEncoding || detectedEncoding.toLowerCase() == 'utf-8' || detectedEncoding.toLowerCase() == 'ascii') {
    return buffer.toString();
  }

  return iconvLite.decode(buffer, detectedEncoding);

}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  converToUTF8: converToUTF8
};
