define('recipme-ember/tests/helpers/start-app', ['exports', 'ember', 'recipme-ember/app', 'recipme-ember/config/environment'], function (exports, _ember, _recipmeEmberApp, _recipmeEmberConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _recipmeEmberConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _recipmeEmberApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});