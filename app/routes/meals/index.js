import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return new Ember.RSVP.Promise(resolve => {
      this.store.findAll('meal').then(meals => {
        resolve(meals.filterBy('isNew', false));
      });
    });
  }
});
