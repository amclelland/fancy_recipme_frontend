define('recipme-ember/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'recipme-ember/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _recipmeEmberConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_recipmeEmberConfigEnvironment['default'].APP.name, _recipmeEmberConfigEnvironment['default'].APP.version)
  };
});