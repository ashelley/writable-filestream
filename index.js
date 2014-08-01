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

var BaseStream = (function () {
    function BaseStream() {
    }
    return BaseStream;
})();

util.inherits(BaseStream, Writable);

var FileStream = (function (_super) {
    __extends(FileStream, _super);
    function FileStream(filePath, options) {
        _super.call(this);
        Writable.call(this, options);
        this.filePath = filePath;
        this.buffer = new Buffer('');
        var self = this;
    }
    FileStream.prototype.flushToDisk = function (done) {
        var self = this;
        fs.open(this.filePath, 'w', function (err, fd) {
            if (err) {
                done(err);
            } else {
                fs.write(fd, self.buffer, 0, self.buffer.length, null, function (err) {
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
        var buffer = (Buffer.isBuffer(chunk)) ? chunk : new Buffer(chunk, encoding);
        this.buffer = Buffer.concat([this.buffer, buffer]);
        callback();
    };
    return FileStream;
})(BaseStream);

module.exports = FileStream;
