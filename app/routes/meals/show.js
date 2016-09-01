import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('meal', params.meal_id);
  },

  actions: {
    changeName(val) {
      debugger;
      // this.get('model').set('name', val);
      // this.set('name', val);
    }
  }
});
