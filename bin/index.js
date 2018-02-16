#!/usr/bin/env node

/**
 * Subtitle Download
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

var subscene = require('./subscene')
  , input    = require('./input')
  , download = require('./download')
  , encoding = require('./encoding')
  , files    = require('./files');

// Get movie name from the video file
files.getMovieName().then(function(defaultMovieName) {
  
  return input.askForMovieName(defaultMovieName);

// Search for the movie in Subscene
}).then(function(movieName) {

  return subscene.search(movieName);
  
// Choose from the search results
}).then(function(searchResults) {

  return input.chooseSearchResult(searchResults);
  
// Get a list of subtitles
}).then(function(subtitlesListLink) {

  return subscene.list(subtitlesListLink);
  
// Choose from the subtitles list
}).then(function(subtitlesList) {

  return input.chooseSubtitle(subtitlesList);

// Get the downloading link
}).then(function(subtitlePageLink) {

  return subscene.getDownloadLink(subtitlePageLink);
  
// Download the subtitle file
}).then(function(downloadLink) {

  return download.fetch(downloadLink);
  
// Convert to UTF8
}).then(function(subtitle) {

  subtitle.content = encoding.converToUTF8(subtitle.content);

  return subtitle;

// Save the subtitle to a file with a matching name
}).then(function(subtitle) {

  return files.saveSubtitle(subtitle.content, subtitle.type);

// Done
}).then(function() {
  
  console.log('Done !');

}).catch(function(error) {

  // Something went wrong
  if (error) {
    console.error(error.toString());
  }
  
});
