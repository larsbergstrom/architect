module.exports = {
  default: {},
  parse: function objectParse (value) {
    if (!value) { return null; }
    if (typeof value !== 'string') { return value; }
    // Add double quotes if not true JSON.
    value = value.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
    return JSON.parse(value);
  },
  stringify: JSON.stringify
};
