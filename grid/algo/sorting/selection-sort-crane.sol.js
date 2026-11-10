const f = (crane) => {
  const n = crane.getLength();
  for (let i = 0; i < n - 1; i++) {
    let m = i;
    let min = crane.scan(i);
    for (let j = i + 1; j < n; j++) {
      const v = crane.scan(j);
      if (v < min) {
        min = v;
        m = j;
      }
    }
    if (m !== i) {
      crane.grab(i);
      crane.grab(m);
      crane.put(i);
      crane.put(m);
    }
  }
};

module.exports = f;
