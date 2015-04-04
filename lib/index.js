var PUBNUB   = process.browser ? require("pubnub-browserify") : {};
var sift     = require("sift");
var Writable = require("obj-stream").Writable;
var extend   = require("xtend");

module.exports = function(options, reject) {

  if (!reject) reject = ["load"];

  var clientId = Date.now() + "_" + Math.round(Math.random() * 999999999);

  var c = options.subscribe ? options : PUBNUB.init({
    "publish_key"   : options.publishKey,
    "subscribe_key" : options.subscribeKey
  });

  var clients = [];
  var tails   = [];

  if (options.channel) {
    addChannel(options.channel);
  }

  function createStream(operation) {
    var stream = new Writable();

    process.nextTick(function() {

      if (operation.name === "tail") {
        return tail(stream, operation);
      }

      if (!operation.remoteClientId && !~reject.indexOf(operation.name)) {
        operation.remoteClientId = clientId;
        for (var i = clients.length; i--;) {
          clients[i].send(operation);
        }
      }

      stream.end();
    });

    return stream.reader;
  }

  function addChannel(channel) {

    c.subscribe({
      channel: channel,
      callback: function(operation) {
        if (operation.remoteClientId === clientId) return;
        for (var i = tails.length; i--;) {
          if (tails[i].test(operation)) {
            tails[i].stream.emit("data", operation);
          }
        }
      }
    });

    clients.push({
      send: function(data) {
        c.publish({
          channel: channel,
          message: data
        });
      }
    });
  }

  createStream.addChannel = addChannel;

  return createStream;

  function tail (stream, operation) {
    if (operation) {
      operation = JSON.parse(JSON.stringify(operation));
      delete operation.name;
    }
    tails.push({
      test: sift(properties ? properties : function() { return true; }),
      stream: stream
    });
  }
};
