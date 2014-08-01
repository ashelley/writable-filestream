/// <reference path="../types/node.d.ts" />

var stream = require('stream');
var util = require('util');
var Writable = stream.Writable;
var fs = require('fs');

class BaseStream {

}

util.inherits(BaseStream, Writable);    

class FileStream extends BaseStream {
  private buffer;
  private filePath;
  constructor(filePath, options) {    
    super();
    Writable.call(this, options);    
    this.filePath = filePath;
    this.buffer = new Buffer('');
    var self = this;
  }

  flushToDisk(done:Function) {
    var self = this
    fs.open(this.filePath, 'w', function(err, fd) {
      if(err) {
        done(err);
      } else {
        fs.write(fd, self.buffer, 0, self.buffer.length, null, function(err) {
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
    var buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, encoding);
    this.buffer = Buffer.concat([this.buffer, buffer]);
    callback();
  }
}

module.exports = FileStream;
