var expect  = require("expect.js");
var sinon   = require("sinon");
var mesh = require("mesh");
var pubnub  = require("..");

describe(__filename + "#", function() {

  var fakeClient;

  beforeEach(function() {
    fakeClient = {
      subs: [],
      pubs: [],
      subscribe: function(options) {
        fakeClient.subs.push(options);
      },
      publish: function(options) {
        fakeClient.pubs.push(options);
      }
    };
  });

  it("can be created", function() {
    pubnub(fakeClient);
  });

  it("can add channel in the options", function() {
    fakeClient.channel = "a";
    pubnub(fakeClient);
    expect(fakeClient.subs.length).to.be(1);
  });

  xit("can add a channel by publishing it", function() {

  });

  it("braodcasts everything", function(next) {
    fakeClient.channel = "a";
    var db = mesh.clean(pubnub(fakeClient));
    db("insert");
    db("remove");
    db("update");
    db("fdfdsfs");
    db("load");
    setTimeout(function() {
      expect(fakeClient.pubs.length).to.be(5);
      next();
    }, 10);
  });

  it("passes remote events back to the passed bus", function(next) {

    fakeClient.channel = "a";
    pubnub(fakeClient, mesh.wrap(function(operation) {
      next();
    }));

    fakeClient.subs[0].callback(mesh.op("insert"))
  });
});
