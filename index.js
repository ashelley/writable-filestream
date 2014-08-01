/// <reference path="../types/node.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var stream = require('stream');
var util = require('util');
var Writable = stream.Writable;
var fs = require('fs');
var streamBuffers = require('stream-buffers');

var BaseStream = (function () {
    function BaseStream() {
    }
    return BaseStream;
})();

util.inherits(BaseStream, Writable);

var FileStream = (function (_super) {
    __extends(FileStream, _super);
    function FileStream(filePath, options) {
        var bufferOptions;
        if (options) {
            bufferOptions = options.bufferOptions;
        }
        _super.call(this);
        Writable.call(this, options);
        this.filePath = filePath;
        this.buffer = new streamBuffers.WritableStreamBuffer(bufferOptions);
    }
    FileStream.prototype.flushToDisk = function (done) {
        var self = this;
        fs.open(this.filePath, 'w', function (err, fd) {
            if (err) {
                done(err);
            } else {
                var length = self.buffer.size();
                var buffer = self.buffer.getContents();
                fs.write(fd, buffer, 0, length, null, function (err) {
                    if (err) {
                        done(err);
                    } else {
                        fs.close(fd, function () {
                            done();
                        });
                    }
                });
            }
        });
    };

    FileStream.prototype.end = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var self = this;
        self.flushToDisk(function (err) {
            if (err) {
                self.emit("error", err);
            } else {
                self.emit.apply(self, ['finish'].concat(args));
            }
        });
    };

    FileStream.prototype._write = function (chunk, encoding, callback) {
        this.buffer.write(chunk, encoding);
        callback();
    };
    return FileStream;
})(BaseStream);

module.exports = FileStream;
