var Handlebars = require('handlebars');

//Time-ago
const helpers={};

//Compare if
Handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

Handlebars.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) { return options.fn(this); }
  return options.inverse(this);
});
module.exports = helpers;