import { blocks } from './decoders';

const fs = require('fs');

module.exports = {
  fromfile: filePath => blocks(fs.readFileSync(filePath, 'utf-8')).replace(/(\n)/g, ''),
  fromString: string => blocks(string).replace(/(\n)/g, ''),
};
