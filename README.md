[![Build Status](https://travis-ci.org/mojo-js/crudlet-pubnub.svg)](https://travis-ci.org/mojo-js/crudlet-pubnub) [![Coverage Status](https://coveralls.io/repos/mojo-js/crudlet-pubnub/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/crudlet-pubnub?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/crudlet-pubnub.svg)](https://david-dm.org/mojo-js/crudlet-pubnub)

```javascript
var crud        = require("crudlet");
var localStore  = require("crudlet-local-storage");
var pubnub      = require("crudlet-pubnub");

var db = pubnub({
  subscribeKey: "sub key"
  publishKey: "pub key",
  channel: "channel"
});


// pipe all ops to local store
db("tail").pipe(crud.open(localStore));

// broadcast
db("insert", { data: { name: "abba" }});
```
