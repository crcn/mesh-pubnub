```javascript
var crudlet     = require("crudlet");
var localStore  = require("crudlet-local-storage");
var webrtc      = require("crudlet-webrtc");

// get key here: http://peerjs.com/
var webRtcDb = webrtc({ key: "peer-id" });
var db = crudlet.parallel(localStore(), webRtcDb);

webRtcDb.peer.connect("peerId");

crudlet.run(db, "tail").on("data", function(operation) {
  
});

crudlet.stream(db).write(crudlet.operation("insert", {data: "blarg" }));
```