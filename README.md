```javascript
var crudlet     = require("crudlet");
var localStore  = require("crudlet-local-storage");
var pubnub      = require("crudlet-pubnub");

var db = pubnub({
  subscribeKey: "sub key"
  publishKey: "pub key",
  channel: "channel"
});


// pipe all ops to local store
db("tail").pipe(crudlet.open(localStore));

// broadcast
db("insert", { data: { name: "abba" }});
```
