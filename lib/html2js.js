var util = require('util');


var TEMPLATE = 'angular.module(\'%s\', []).run(function($templateCache) {\n' +
    '  $templateCache.put(\'%s\',\n    \'%s\');\n' +
    '});\n';

var SINGLE_MODULE_TPL = '(function(module) {\n' +
    'try {\n' +
    '  module = angular.module(\'%s\');\n' +
    '} catch (e) {\n' +
    '  module = angular.module(\'%s\', []);\n' +
    '}\n' +
    'module.run(function($templateCache) {\n' +
    '  $templateCache.put(\'%s\',\n    \'%s\');\n' +
    '});\n' +
    '})();\n';

var escapeContent = function(content) {
  return content.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n/g, '\\n\' +\n    \'');
};

var replaceTags = function(content, tags) {
  for (var name in tags) {
    content = content.split('{% ' + name + ' %}').join(tags[name]).split('{{ ' + name + ' }}').join(tags[name]);
  }
  content = content.replace(/{% comment %}/g, '/*').replace(/{% endcomment %}/g, '*/');
  return content.replace(/{%.*%}/g, '').replace(/{{.*}}/g,'');
}

var updateTags = function(content, aliases) {
  for (var i=0, len=aliases.length; i<len; i++) {
    content = content.split(aliases[i].original).join(aliases[i].updated);
  }
  return content;
}

var createHtml2JsPreprocessor = function(logger, basePath, config) {
  config = typeof config === 'object' ? config : {};

  var log = logger.create('preprocessor.html2js');
  var moduleName = config.moduleName;
  var stripPrefix = new RegExp('^' + (config.stripPrefix || ''));
  var prependPrefix = config.prependPrefix || '';
  var djangoTags = config.djangoTags || {};
  var aliasTags = config.aliasTags || [];
  var cacheIdFromPath = config && config.cacheIdFromPath || function(filepath) {
    return prependPrefix + filepath.replace(stripPrefix, '');
  };

  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    var htmlPath = cacheIdFromPath(file.originalPath.replace(basePath + '/', ''));
    var htmlPathNoExtension = htmlPath.replace(/\.html$/, '');

    file.path = file.path + '.js';

    if (moduleName) {
      done(util.format(SINGLE_MODULE_TPL, moduleName, moduleName, htmlPath, escapeContent(updateTags(replaceTags(content, djangoTags), aliasTags))));
    } else {
      done(util.format(TEMPLATE, htmlPath, htmlPath, escapeContent(updateTags(replaceTags(content, djangoTags), aliasTags))));
    }
  };
};

createHtml2JsPreprocessor.$inject = ['logger', 'config.basePath', 'config.ngDjangoHtml2JsPreprocessor'];

module.exports = createHtml2JsPreprocessor;
