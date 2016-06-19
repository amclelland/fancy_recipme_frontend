import JSONAPIAdapter from 'ember-data/adapters/json-api';
import Ember from 'ember';
import ENV from '../config/environment';

export default JSONAPIAdapter.extend({
  host: ENV.host,
  pathForType: function(type) {
    return Ember.String.pluralize(Ember.String.underscore(type));
  }
});
