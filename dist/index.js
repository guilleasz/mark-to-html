'use strict';

var _decoders = require('./decoders');

var fs = require('fs');

module.exports = {
  fromfile: function fromfile(filePath) {
    return (0, _decoders.blocks)(fs.readFileSync(filePath, 'utf-8')).replace(/(\n)/g, '');
  },
  fromString: function fromString(string) {
    return (0, _decoders.blocks)(string).replace(/(\n)/g, '');
  }
};
