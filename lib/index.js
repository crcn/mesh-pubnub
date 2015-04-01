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

  function createStream(name, properties) {
    if (!properties) properties = {};
    var stream = new Writable();

    process.nextTick(function() {

      if (name === "tail") {
        return tail(stream, properties);
      }

      if (!properties.remoteClientId && !~reject.indexOf(name)) {
        properties.remoteClientId = clientId;
        for (var i = clients.length; i--;) {
          clients[i].send(extend({ name: name }, properties));
        }
      }

      stream.end();
    });

    return stream;
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

  function tail (stream, properties) {
    tails.push({
      test: sift(properties ? JSON.parse(JSON.stringify(properties)) : function() { return true; }),
      stream: stream
    });
  }
};
