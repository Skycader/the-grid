const f = txt => txt.replace(/(https?:\/\/(?:[\w-]+\.)*)([\w-]+)(\.\w+(?:\/[\w.?#=-]+)*)/g, '<a href="$1$2$3">$2</a>');
module.exports = f;
