'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.code = code;
exports.bold = bold;
exports.italic = italic;
exports.image = image;
exports.link = link;
exports.inlines = inlines;
exports.header = header;
exports.unorderList = unorderList;
exports.paragraph = paragraph;
exports.orderList = orderList;
exports.blocks = blocks;
function htmlEscape(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function code(string) {
  var eString = htmlEscape(string);
  if (string.split('\n')[0].split(' ').length > 1 || string.split('\n').length < 2) {
    return eString.replace('```', '<code>').replace('```', '</code>').replace(/\n/g, '<br>');
  }
  var arr = eString.split('```');
  arr[0] = '<pre><code class="' + arr[1].split('\n')[0] + '">';
  arr[1] = arr[1].split('\n');
  arr[1][0] = '';
  arr[1] = arr[1].map(function (item) {
    return !item ? '\n' : item;
  }).join('');
  arr.push('</code></pre>');
  return arr.join('').replace(/\n/g, '<br>');
}

function bold(string) {
  return '<strong>' + string + '</strong>';
}

function italic(string) {
  return '<em>' + string + '</em>';
}

function image(string) {
  return '<img src="' + string.split('(')[1].split(')')[0] + '" alt="' + string.split('[')[1].split(']')[0] + '">';
}

function link(string) {
  return '<a href="' + string.split('(')[1].split(')')[0] + '">' + string.split('[')[1].split(']')[0] + '</a>';
}

function inlines(string) {
  return string.split('**').map(function (item, i) {
    if (i % 2 && i) {
      return bold(item);
    }
    return item;
  }).join('').split('*').map(function (item, i) {
    if (i % 2 && i) {
      return italic(item);
    }
    return item;
  }).map(function (item) {
    var result = item;
    var rep = item.match(/(!\[.+?\]\(.+?\))/g) || [];
    var change = rep.map(function (s) {
      return image(s);
    });
    change.forEach(function (c, i) {
      result = result.replace(rep[i], c);
    });
    return result;
  }).map(function (item) {
    var result = item;
    var rep = item.match(/(\[.+?\]\(.+?\))/g) || [];
    var change = rep.map(function (s) {
      return link(s);
    });
    change.forEach(function (c, i) {
      result = result.replace(rep[i], c);
    });
    return result;
  }).join('').split('```').map(function (item, i) {
    if (i % 2 && i) {
      return code('```' + item + '```');
    }
    return item;
  }).join('');
}

function header(string) {
  var h = 1;
  var arr = string.split('# ');
  var isAHeader = true;
  arr[0].split('').forEach(function (char) {
    if (char !== '#') {
      isAHeader = false;
    }
    h += 1;
  });
  if (isAHeader && h < 7) {
    arr[0] = '<h' + h + '>';
    arr.push('</h' + h + '>');
  } else if (isAHeader) {
    arr[0] += '# ';
  }
  return inlines(arr.join(''));
}
function unorderList(string) {
  var arr = string.split('\n');
  arr.unshift('<ul>');
  arr.push('</ul>');
  for (var i = 1; i < arr.length - 1; i += 1) {
    if (arr[i][0] === '-' && arr[i][1] === ' ') {
      if (i > 1) arr[i - 1] += '</li>';
      arr[i] = arr[i].split(' ').slice(1).join(' ');
      arr[i] = '<li>' + arr[i];
    } else if (arr[i][0] === ' ' && Number(arr[i][1]) && arr[i][2] === '.' && arr[i][3] === ' ') {
      arr[i] = arr[i].slice(1);
      for (var j = i + 1; arr[j][0] === ' '; j += 1) {
        arr[i] += '\n' + arr[j].slice(1);
        arr[j] = '';
      }
      arr[i] = orderList(arr[i]) + '\n';
    } else if (arr[i][0] === ' ' && arr[i][1] === '-' && arr[i][2] === ' ') {
      arr[i] = arr[i].slice(1);
      for (var _j = i + 1; arr[_j][0] === ' '; _j += 1) {
        arr[i] += '\n' + arr[_j].slice(1);
        arr[_j] = '';
      }
      arr[i] = unorderList(arr[i]) + '\n';
    }
  }
  arr[arr.length - 2] += '</li>';
  return inlines(arr.join('\n'));
}

function paragraph(string) {
  return inlines('<p>' + string + '</p>');
}

function orderList(string) {
  var arr = string.split('\n');
  arr.unshift('<ol>');
  arr.push('</ol>');
  for (var i = 1; i < arr.length - 1; i += 1) {
    if (Number(arr[i][0]) && arr[i][1] === '.' && arr[i][2] === ' ') {
      if (i > 1) arr[i - 1] += '</li>';
      arr[i] = arr[i].split(' ').slice(1).join(' ');
      arr[i] = '<li>' + arr[i];
    } else if (arr[i][0] === ' ' && Number(arr[i][1]) && arr[i][2] === '.' && arr[i][3] === ' ') {
      arr[i] = arr[i].slice(1);
      for (var j = i + 1; arr[j][0] === ' '; j += 1) {
        arr[i] += '\n' + arr[j].slice(1);
        arr[j] = '';
      }
      arr[i] = orderList(arr[i]) + '\n';
    } else if (arr[i][0] === ' ' && arr[i][1] === '-' && arr[i][2] === ' ') {
      arr[i] = arr[i].slice(1);
      for (var _j2 = i + 1; arr[_j2][0] === ' '; _j2 += 1) {
        arr[i] += '\n' + arr[_j2].slice(1);
        arr[_j2] = '';
      }
      arr[i] = unorderList(arr[i]) + '\n';
    }
  }
  arr[arr.length - 2] += '</li>';
  return inlines(arr.join('\n'));
}

function blocks(string) {
  var arr = string.split('\n');
  for (var i = 0; i < arr.length; i += 1) {
    if (arr[i][0] === '#') {
      arr[i] = header(arr[i]) + '\n';
    } else if (arr[i].slice(0, 3) === '1. ') {
      for (var j = i + 1; arr[j]; j += 1) {
        arr[i] += '\n' + arr[j];
        arr[j] = '';
      }
      arr[i] = orderList(arr[i]) + '\n';
    } else if (arr[i].slice(0, 2) === '- ') {
      for (var _j3 = i + 1; arr[_j3]; _j3 += 1) {
        arr[i] += '\n' + arr[_j3];
        arr[_j3] = '';
      }
      arr[i] = unorderList(arr[i]) + '\n';
    } else if (arr[i].slice(0, 3) === '```' && !arr[i].match(/`{3}(.+)(?:`{3})/g)) {
      var last = void 0;
      for (var _j4 = i + 1; (!arr[_j4] || arr[_j4].slice(0, 3) !== '```') && _j4 < arr.length; _j4 += 1) {
        arr[i] += '\n' + arr[_j4];
        arr[_j4] = '';
        last = _j4 + 1;
      }
      arr[i] += '\n' + arr[last];
      arr[last] = '';
      arr[i] = code(arr[i]) + '\n';
    } else if (arr[i]) {
      for (var _j5 = i + 1; arr[_j5] && arr[_j5][0] !== '#' && arr[_j5].slice(0, 3) !== '1. '; _j5 += 1) {
        arr[i] += ' ' + arr[_j5];
        arr[_j5] = '';
      }
      arr[i] = paragraph(arr[i]) + '\n';
    }
  }
  return arr.join('');
}
