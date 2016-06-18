import JSONAPIAdapter from 'ember-data/adapters/json-api';
import Ember from 'ember';

export default JSONAPIAdapter.extend({
  host: 'http://recipme-rails.herokuapp.com',
  pathForType: function(type) {
    return Ember.String.pluralize(Ember.String.underscore(type));
  }
});
