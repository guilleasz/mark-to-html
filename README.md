# Mark To Html

Simple Javascript Library for turning Markdown to HTML

## Installation

```$ npm install mark-to-html```


## Usage

```javascript
const mkToHtml = require("mark-to-html");

const htmlFromFile = mkToHtml.fromfile(__dirname+"./readme.md");

const htmlFromString = mkToHtml.fromString('# Hello World')
```
