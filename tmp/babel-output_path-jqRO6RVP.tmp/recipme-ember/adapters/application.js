define('recipme-ember/adapters/application', ['exports', 'ember-data/adapters/json-api', 'ember'], function (exports, _emberDataAdaptersJsonApi, _ember) {
  exports['default'] = _emberDataAdaptersJsonApi['default'].extend({
    pathForType: function pathForType(type) {
      return _ember['default'].String.pluralize(_ember['default'].String.underscore(type));
    }
  });
});