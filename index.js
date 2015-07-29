"use strict";
// A function to make streams for us
function Stream(){
  var registeredListeners = [];
  return {
    // Have an observe function, so
    // people who are interested can
    // get notified when there is an update
    observe: function(callback){
      registeredListeners.push(callback)
    },

    // Add a value to this stream
    // Once added, will notify all
    // interested parties
    update: function(value){
      registeredListeners.forEach(function(cb){
        cb(value);
      })
    }
  }
}

// A function to make a new stream from an existing stream
// a reducing function, and an initial reduced value
function reduceStream(stream, reducingFunction, initialReducedValue){
  var newStream = Stream();
  var reducedValue = initialReducedValue;

  stream.observe(function(streamSnapshotValue){
    reducedValue = reducingFunction(reducedValue, streamSnapshotValue);
    newStream.update(reducedValue);
  });
  return newStream;
}

// A merge streams helper function
function mergeStreams(streamA, streamB, mergeFn){

  var streamData = [null, null];
  var newStream = Stream();

  streamA.observe(function(value){
    streamData[0] = value;
    newStream.update(mergeFn.apply(null,streamData));
  });
  streamB.observe(function(value){
    streamData[1] = value;
    newStream.update(mergeFn.apply(null,streamData));
  });

  return newStream;
}

// same as above but blocks until both streams emit non null
function blockMergeStreams(streamA, streamB, mergeFn){

  var streamData = [null, null];
  var newStream = Stream();

  streamA.observe(function(value){
    streamData[0] = value;
    if (streamData[1] !== null){
      var temp = streamData;
      streamData = [null, null];
      newStream.update(mergeFn.apply(null,temp));
    }
  });
  streamB.observe(function(value){
    streamData[1] = value;
    if (streamData[0] !== null) {
      var temp = streamData;
      streamData = [null, null];
      newStream.update(mergeFn.apply(null,temp));
    }
  });

  return newStream;
}

function mapStream(stream, mappingFn) {
  var newStream = Stream();
  stream.observe(function(v){
    newStream.update(mappingFn(v));
  });
  return newStream;
}

module.exports = {
  Stream: Stream,
  reduceStream: reduceStream,
  mergeStreams: mergeStreams,
  blockMergeStreams: blockMergeStreams,
  mapStream: mapStream
}
