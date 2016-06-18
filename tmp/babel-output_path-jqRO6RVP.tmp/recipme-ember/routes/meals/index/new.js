define('recipme-ember/routes/meals/index/new', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.store.createRecord('meal');
    },

    actions: {
      create: function create() {
        var newMeal = this.get('currentModel');
        newMeal.save();
        this.transitionTo('meals');
      }
    }
  });
});