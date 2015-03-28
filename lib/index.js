var through      = require("through2");
var PUBNUB       = require("pubnub-browserify");
var sift         = require("sift");

module.exports = function(options) {


  var c = PUBNUB.init(options);

  var streams   = [];
  var listeners = [];


  function createStream() {
    return through.obj(function(operation, enc, next) {

      if (operation.name === "tail") {
        return tail(this, operation);
      }

      if (!operation.remote && /insert|update|remove/.test(operation.name)) {
        for (var i = streams.length; i--;) {
          streams[i].send(operation);
        }
      }

      next();
    });
  };

  createStream.addChannel = function(channel) {

    c.subscribe({
      channel: channel,
      callback: function(operation) {
        operation.remote = true;
        for (var i = listeners.length; i--;) {
          if (listeners[i].test(operation)) {
            listeners[i].stream.push(operation);
          }
        }
      }
    });

    streams.push({
      send: function(data) {
        c.publish({
          channel: channel,
          message: data
        });
      }
    });
  }



  return createStream;

  function tail (stream, operation) {
    var op = JSON.parse(JSON.stringify(operation));
    delete op.name;

    listeners.push({
      test: sift(op),
      stream: stream
    });
  }
};