define('recipme-ember/routes/meals/show', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.store.findRecord('meal', params.meal_id);
    }
  });
});