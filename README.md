# karma-ng-django-html2js-preprocessor

> Preprocessor for converting HTML files with [Django](https://www.djangoproject.com/) tags to [AngularJS](http://angularjs.org/) templates.

*Note:* If you are looking for a AngularJS preprocessor that is not tight to Django, check out [karma-ng-html2js-preprocessor](https://github.com/karma-runner/karma-ng-html2js-preprocessor).

*Note:* If you are looking for a general preprocessor that is not tight to Angular, check out [karma-html2js-preprocessor](https://github.com/karma-runner/karma-html2js-preprocessor).

## Installation

The easiest way is to keep `karma-ng-django-html2js-preprocessor` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-ng-django-html2js-preprocessor": "~0.1.3"
  }
}
```

You can simple do it by:
```bash
npm install karma-ng-django-html2js-preprocessor --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.html': ['ng-django-html2js']
    },

    files: [
      '*.js',
      '*.html',
      // if you wanna load template files in nested directories, you must use this
      '**/*.html'
    ],

    ngDjangoHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'public/',
      // prepend this to the
      prependPrefix: 'served/',

      // or define a custom transform function
      cacheIdFromPath: function(filepath) {
        return cacheId;
      },

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'foo'
      
      // define custom replacements for template tags
      // (any unspecified tags will be replaced with '')
      djangoTags: {
        static_url: '/static/',
        comment: '/*',
        endcomment: '*/'
      }

      // define custom replacements for tag symbols 
      aliasTags: [{
        original: '{[',
        updated: '{{'
      },
      {
        original: ']}',
        updated: '}}'
      }]
    }
  });
};
```

## How does it work ?

This preprocessor converts HTML files into JS strings, strips out Django tags and generates Angular modules. These modules, when loaded, puts these HTML files into the `$templateCache` and therefore Angular won't try to fetch them from the server.

For instance, using the above configuration, this `public/template.html`...
```html
{% comment %}
  Some comment
{% endcomment %}

{% load templatetags %}

<img ng-src="{% static_url %}image.png"></img>
<div>{[ message ]}</div>
```
... will be served as `template.html.js`:
```js
(function(module) {
try {
  module = angular.module('foo');
} catch (e) {
  module = angular.module('foo', []);
}
module.run(function($templateCache) {
  $templateCache.put('served/template.html',
    '/*\n' +
    '  Some comment\n' +
    '*/\n' +
    '\n' +
    '\n' +
    '\n' +
    '<img ng-src="/static/img.png"></img>\n' +
    '<div>{{ message }}</div>');
});
})();
```

See the [ng-directive-testing](https://github.com/vojtajina/ng-directive-testing) for a complete example.

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
