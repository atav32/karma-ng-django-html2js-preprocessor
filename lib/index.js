// PUBLISH DI MODULE
module.exports = {
  'preprocessor:ng-django-html2js': ['factory', require('./html2js')],
  // TODO(vojta): remove this in 0.11
  'preprocessor:html2js': ['factory', require('./html2js')]
};
