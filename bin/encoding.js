var iconvLite = require('iconv-lite')
  , jschardet = require('jschardet');

/**
 * Convert encoding to UTF-8
 *
 * @param  {Buffer} buffer
 * @return {String}
 */
function converToUTF8(buffer) {

  // Detect the encoding
  var detectedEncoding = jschardet.detect(buffer.toString()).encoding;

  // Already UTF8
  if (!detectedEncoding || detectedEncoding.toLowerCase() == 'utf-8' || detectedEncoding.toLowerCase() == 'ascii') {
    return buffer.toString();
  }

  // Fix
  if (detectedEncoding == 'windows-1252') {
    detectedEncoding = 'windows-1256';
  }

  return iconvLite.decode(buffer, detectedEncoding);

}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  converToUTF8: converToUTF8
};
