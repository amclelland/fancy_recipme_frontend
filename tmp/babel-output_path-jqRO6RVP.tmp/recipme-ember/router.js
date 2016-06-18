define('recipme-ember/router', ['exports', 'ember', 'recipme-ember/config/environment'], function (exports, _ember, _recipmeEmberConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _recipmeEmberConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('meals', function () {
      this.route('index', { path: '/' }, function () {
        this.route('new');
      });
      this.route('show', { path: ':meal_id' });
    });

    this.route('not-found', { path: '/*path' });
  });

  exports['default'] = Router;
});