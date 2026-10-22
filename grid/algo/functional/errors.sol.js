const f = (errors) => Object.entries(errors).flatMap(([key, messages]) => messages.map((message) => `${key} ${message}`));

module.exports = f;
