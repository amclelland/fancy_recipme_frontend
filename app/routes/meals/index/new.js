import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('meal');
  },

  actions: {
    create: function() {
      var newMeal = this.get('currentModel');
      newMeal.save().then(() => this.transitionTo('meals.show', newMeal));
    }
  }
});
