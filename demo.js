var SimpleStreams = require("./index");
Stream = SimpleStreams.Stream;
reduceStream = SimpleStreams.reduceStream;
mapStream = SimpleStreams.mapStream;
mergeStreams = SimpleStreams.mergeStreams;
blockMergeStreams = SimpleStreams.blockMergeStreams;

var counter = Stream();

counter.observe(function(v){
  console.log("Counter emitted: ", v)
})

var excitedCounter = mapStream(counter, function(v){return v+"!!"});
excitedCounter.observe(function(v){
  console.log("Excited Counter emitted: ", v)
})

var sum = reduceStream(counter, function(initial, v){
  return initial + v
}, 0)
sum.observe(function(v){
  console.log("Sum emitted: ", v)
})

var doubleTrouble = blockMergeStreams(counter, excitedCounter, function(c, ec){
  return c + "?? more like " + ec;
})
doubleTrouble.observe(function(v){
  console.log("Double Trouble emitted: ", v)
})

var everythingEmittedStream = [excitedCounter, sum, doubleTrouble, counter].reduce(function(acc, stream){
  return blockMergeStreams(acc, stream, function(){return "OK"});
})

everythingEmittedStream.observe(function(v){
  console.log("--------------------\n")
})


for (var i=0; i<10; i++){
  counter.update(i);
}
