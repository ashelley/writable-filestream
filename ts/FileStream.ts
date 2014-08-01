/// <reference path="../types/node.d.ts" />

var stream = require('stream');
var util = require('util');
var Writable = stream.Writable;
var fs = require('fs');
var streamBuffers = require('stream-buffers');

class BaseStream {

}

util.inherits(BaseStream, Writable);    

class FileStream extends BaseStream {
  private buffer;
  private filePath;
  constructor(filePath, options) {    
    var bufferOptions
    if(options) {
      bufferOptions = options.bufferOptions;
    }
    super();
    Writable.call(this, options);    
    this.filePath = filePath;
    this.buffer = new streamBuffers.WritableStreamBuffer(bufferOptions);
  }

  flushToDisk(done:Function) {
    var self = this
    fs.open(this.filePath, 'w', function(err, fd) {
      if(err) {
        done(err);
      } else {
        var length = self.buffer.size();
        var buffer = self.buffer.getContents();
        fs.write(fd, buffer, 0, length, null, function(err) {
          if(err) {
            done(err);
          } else {
            fs.close(fd, function() {
              done();
            })
          }
        });
      }
    });
  }

  end() {    
    var args = Array.prototype.slice.call(arguments, 0);
    var self = this;    
    self.flushToDisk(function(err) {
      if(err) {
        (<any>self).emit("error", err);
      } else {
        (<any>self).emit.apply(self, ['finish'].concat(args));
      }
    });
  }  

  _write(chunk, encoding, callback) {    
    this.buffer.write(chunk, encoding);
    callback();
  }
}

module.exports = FileStream;
