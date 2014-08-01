A simple replacement for fs.createWriteStream that uses [stream buffers](https://www.npmjs.org/package/stream-buffers).  

Why? 
- fs.createWriteStream as of Node 10.30 seems to have problems if you write to it alot. See https://github.com/joyent/node/issues/8048

Installation

First clone this repo and npm link it.  Then in your dependant repository run
```
npm link writable-filestream
```

Usage
```
var FileStream = require('writable-filestream');
var stream = new FileStream('path/to/my/file', {
    bufferOptions: {
        initialSize: (100*1024),
        incrementAmount: (100*1024)
    }
});
```

TODO
- tests
- while flushing write data out in chunks and allow event loop to drain
- smarter growth pattern?