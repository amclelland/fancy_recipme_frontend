define('recipme-ember/tests/helpers/resolver', ['exports', 'recipme-ember/resolver', 'recipme-ember/config/environment'], function (exports, _recipmeEmberResolver, _recipmeEmberConfigEnvironment) {

  var resolver = _recipmeEmberResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _recipmeEmberConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _recipmeEmberConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});