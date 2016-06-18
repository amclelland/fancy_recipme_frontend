define('recipme-ember/app', ['exports', 'ember', 'recipme-ember/resolver', 'ember-load-initializers', 'recipme-ember/config/environment'], function (exports, _ember, _recipmeEmberResolver, _emberLoadInitializers, _recipmeEmberConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _recipmeEmberConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _recipmeEmberConfigEnvironment['default'].podModulePrefix,
    Resolver: _recipmeEmberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _recipmeEmberConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});