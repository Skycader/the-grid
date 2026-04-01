const f = (text) => {
  const r =
    /(?=\S*[A-Z]\S*)(?=\S*[a-z]\S*)(?=\S*[0-9]\S*)(?=\S*[!@#$%^&*]\S*)[A-Za-z0-9!@#$%^&*]{8,}/g;
  return text.match(r) || [];
};

module.exports = f;
