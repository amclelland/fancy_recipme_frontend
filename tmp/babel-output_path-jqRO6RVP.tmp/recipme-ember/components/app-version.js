define('recipme-ember/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'recipme-ember/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _recipmeEmberConfigEnvironment) {

  var name = _recipmeEmberConfigEnvironment['default'].APP.name;
  var version = _recipmeEmberConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});