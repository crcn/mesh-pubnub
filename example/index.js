var crudlet = require("crudlet");
var pubnub  = require("..");

var db = pubnub({ 
  publish_key: "pub-c-ca2119a6-a6a6-4374-8020-c94f5e439d77",
  subscribe_key: "sub-c-5bbdee5e-d560-11e4-b585-0619f8945a4f"
});

db.addChannel("chatroom");

crudlet.run(db, "tail").on("data", function(operation) {
  console.log("remote operation:", operation);
});

global.crudlet = crudlet;
global.db = db;
global.stream = crudlet.stream(db);
