node-rtpengine-ng
==============
A Node client library for rtpengine.

This is the rewrite of [node-rtpengine](https://github.com/wtcross/node-rtpengine) library written by [Tyler Cross](https://github.com/wtcross), to comply with latest JS standarts.
Additionaly this library implements DTMF listener socket option from rtpmengine, to be able to receive DTMF events from calls taht are going through it.

The intent of this library is to make it easy to build tools that work with [rtpengine](https://github.com/sipwise/rtpengine). Rtpengine has a UDP-based API that involves sending a message of the following form:

`[request cookie][space][bencoded request command payload]`

It will respond with a message like:

`[request cookie][space][bencoded reply payload]`

This library abstracts away the UDP mess and makes it possible to work with rtpengine like this:
```javascript
const Client = require("../lib/Client");

(async function () {
const rtpengine = new Client({host: '127.0.0.1', port: 2223, dtmfHost: '0.0.0.0', dtmfPort: 7901});

rtpengine.on('dtmf', (event, rinfo) => {
	console.log(event);
	console.log(rinfo);
});

rtpengine.on('dtmfListening', (address) => {
	console.log(`Listening for DTMF events on ${address.address}:${address.port}`);
});

const res = await rtpengine.ping();
console.log(res);
})()
```

```
{ result: 'pong' }
{
  callid: 'f1f2e61109f24cd59620642da7aaea67',
  source_tag: 'f5383cf53d9642809e4446500ba29334',
  tags: [ 'f5383cf53d9642809e4446500ba29334', 'as3f25895e' ],
  type: 'DTMF',
  timestamp: 1605740110,
  source_ip: 'x.x.x.x',
  event: 1,
  duration: 200,
  volume: 10
}
{ address: 'x.x.x.x', family: 'IPv4', port: 60208, size: 252 }
```

There is an [example CLI](bin/rtpengine) in this repo that uses the library.
