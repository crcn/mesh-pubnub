var expect  = require("expect.js");
var sinon   = require("sinon");
var crudlet = require("crudlet");
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

  it("braodcasts everything but load", function(next) {
    fakeClient.channel = "a";
    var db = crudlet.clean(pubnub(fakeClient));
    db("insert");
    db("remove");
    db("update");
    db("fdfdsfs");
    db("load");
    setTimeout(function() {
      expect(fakeClient.pubs.length).to.be(4);
      next();
    }, 10);
  });
});
