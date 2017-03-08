function htmlEscape(str) {
  return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
}


export function code(string) {
  const eString = htmlEscape(string);
  if (string.split('\n')[0].split(' ').length > 1 || string.split('\n').length < 2) {
    return eString.replace('```', '<code>').replace('```', '</code>').replace(/\n/g, '<br>').replace(/\t/g,  '<br>&ensp;');
  }
  const arr = eString.split('```');
  arr[0] = `<pre><code class="${arr[1].split('\n')[0]}">`;
  arr[1] = arr[1].split('\n');
  arr[1][0] = '';
  arr[1] = arr[1].map(item => (!item ? '<br>' : item)).join('<br>');
  arr.push('</code></pre>');
  return arr.join('').replace(/\t/g,  '<br>&ensp;');
}

export function bold(string) {
  return `<strong>${string}</strong>`;
}

export function italic(string) {
  return `<em>${string}</em>`;
}

export function image(string) {
  return `<img src="${string.split('(')[1].split(')')[0]}" alt="${string.split('[')[1].split(']')[0]}">`;
}

export function link(string) {
  return `<a href="${string.split('(')[1].split(')')[0]}">${string.split('[')[1].split(']')[0]}</a>`;
}

export function inlines(string) {
  return string
  .split('**')
  .map((item, i) => {
    if (i % 2 && i) {
      return bold(item);
    }
    return item;
  })
  .join('')
  .split('*')
  .map((item, i) => {
    if (i % 2 && i) {
      return italic(item);
    }
    return item;
  })
  .map((item) => {
    let result = item;
    const rep = item.match(/(!\[.+?\]\(.+?\))/g) || [];
    const change = rep.map(s => image(s));
    change.forEach((c, i) => { result = result.replace(rep[i], c); });
    return result;
  })
  .map((item) => {
    let result = item;
    const rep = item.match(/(\[.+?\]\(.+?\))/g) || [];
    const change = rep.map(s => link(s));
    change.forEach((c, i) => { result = result.replace(rep[i], c); });
    return result;
  })
  .join('')
  .split('```')
  .map((item, i) => {
    if (i % 2 && i) {
      return code(`\`\`\`${item}\`\`\``);
    }
    return item;
  })
  .join('')
  .split('`')
  .map((item, i) => {
    if (i % 2 && i) {
      return code(`\`\`\`${item}\`\`\``);
    }
    return item;
  })
  .join('');
}

export function header(string) {
  let h = 1;
  const arr = string.split('# ');
  let isAHeader = true;
  arr[0].split('').forEach((char) => {
    if (char !== '#') {
      isAHeader = false;
    }
    h += 1;
  });
  if (isAHeader && h < 7) {
    arr[0] = `<h${h}>`;
    arr.push(`</h${h}>`);
  } else if (isAHeader) {
    arr[0] += '# ';
  }
  return inlines(arr.join(''));
}
export function unorderList(string) {
  const arr = string.split('\n');
  arr.unshift('<ul>');
  arr.push('</ul>');
  for (let i = 1; i < arr.length - 1; i += 1) {
    if (arr[i][0] === '-' && arr[i][1] === ' ') {
      if (i > 1) arr[i - 1] += '</li>';
      arr[i] = arr[i].split(' ').slice(1).join(' ');
      arr[i] = `<li>${arr[i]}`;
    } else if (arr[i][0] === ' ' && Number(arr[i][1]) && arr[i][2] === '.' && arr[i][3] === ' ') {
      arr[i] = arr[i].slice(1);
      for (let j = i + 1; arr[j][0] === ' '; j += 1) {
        arr[i] += `\n${arr[j].slice(1)}`;
        arr[j] = '';
      }
      arr[i] = `${orderList(arr[i])}\n`;
    } else if (arr[i][0] === ' ' && arr[i][1] === '-' && arr[i][2] === ' ') {
      arr[i] = arr[i].slice(1);
      for (let j = i + 1; arr[j][0] === ' '; j += 1) {
        arr[i] += `\n${arr[j].slice(1)}`;
        arr[j] = '';
      }
      arr[i] = `${unorderList(arr[i])}\n`;
    }
  }
  arr[arr.length - 2] += '</li>';
  return inlines(arr.join('\n'));
}

export function paragraph(string) {
  return inlines(`<p>${string}</p>`);
}


export function orderList(string) {
  const arr = string.split('\n');
  arr.unshift('<ol>');
  arr.push('</ol>');
  for (let i = 1; i < arr.length - 1; i += 1) {
    if (Number(arr[i][0]) && arr[i][1] === '.' && arr[i][2] === ' ') {
      if (i > 1) arr[i - 1] += '</li>';
      arr[i] = arr[i].split(' ').slice(1).join(' ');
      arr[i] = `<li>${arr[i]}`;
    } else if (arr[i][0] === ' ' && Number(arr[i][1]) && arr[i][2] === '.' && arr[i][3] === ' ') {
      arr[i] = arr[i].slice(1);
      for (let j = i + 1; arr[j][0] === ' '; j += 1) {
        arr[i] += `\n${arr[j].slice(1)}`;
        arr[j] = '';
      }
      arr[i] = `${orderList(arr[i])}\n`;
    } else if (arr[i][0] === ' ' && arr[i][1] === '-' && arr[i][2] === ' ') {
      arr[i] = arr[i].slice(1);
      for (let j = i + 1; arr[j][0] === ' '; j += 1) {
        arr[i] += `\n${arr[j].slice(1)}`;
        arr[j] = '';
      }
      arr[i] = `${unorderList(arr[i])}\n`;
    }
  }
  arr[arr.length - 2] += '</li>';
  return inlines(arr.join('\n'));
}


export function blocks(string) {
  const arr = string.split('\n');
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][0] === '#') {
      arr[i] = `${header(arr[i])}\n`;
    } else if (arr[i].slice(0, 3) === '1. ') {
      for (let j = i + 1; arr[j]; j += 1) {
        arr[i] += `\n${arr[j]}`;
        arr[j] = '';
      }
      arr[i] = `${orderList(arr[i])}\n`;
    } else if (arr[i].slice(0, 2) === '- ') {
      for (let j = i + 1; arr[j]; j += 1) {
        arr[i] += `\n${arr[j]}`;
        arr[j] = '';
      }
      arr[i] = `${unorderList(arr[i])}\n`;
    } else if (arr[i].slice(0, 3) === '```' && !(arr[i].match(/`{3}(.+)(?:`{3})/g))) {
      let last;
      for (let j = i + 1; (!arr[j] || arr[j].slice(0, 3) !== '```') && j < arr.length; j += 1) {
        arr[i] += `\n${arr[j]}`;
        arr[j] = '';
        last = j + 1;
      }
      arr[i] += `\n${arr[last]}`;
      arr[last] = '';
      arr[i] = `${code(arr[i])}\n`;
    } else if (arr[i]) {
      for (let j = i + 1; arr[j] && arr[j][0] !== '#' && arr[j].slice(0, 3) !== '1. '; j += 1) {
        arr[i] += ` ${arr[j]}`;
        arr[j] = '';
      }
      arr[i] = `${paragraph(arr[i])}\n`;
    }
  }
  return arr.join('');
}
