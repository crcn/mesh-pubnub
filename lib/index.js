var through = require("through2");
var PUBNUB  = require("pubnub-browserify");
var sift    = require("sift");
var Stream  = require("stream");
var extend  = require("xtend");

module.exports = function(options, reject) {

  if (!reject) reject = ["load"];

  var c = PUBNUB.init({
    publish_key: options.publishKey,
    subscribe_key: options.subscribeKey
  });

  var clientId = Date.now() + "_" + Math.round(Math.random() * 999999999);

  var clients = [];
  var tails   = [];


  function createStream(name, properties) {
    var stream = new Stream();

    process.nextTick(function() {
      if (name === "tail") {
        return tail(stream, properties);
      }

      if (!properties.remoteClientId && !!~reject.indexOf(name)) {
        properties.remoteClientId = clientId;
        for (var i = clients.length; i--;) {
          clients[i].send(extend({ name: name }, properties));
        }
      }

      stream.emit("end");
    });

    return stream;
  };

  createStream.addChannel = function(channel) {

    c.subscribe({
      channel: channel,
      callback: function(operation) {
        if (operation.remoteClientId === clientId) return;
        console.log(operation);
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

  return createStream;

  function tail (stream, properties) {
    tails.push({
      test: sift(properties ? JSON.parse(JSON.stringify(properties)) : function(){ return true }),
      stream: stream
    });
  }
};
