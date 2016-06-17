import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('meals');
  this.route('meal', { path: '/meal/:meal_id' });
  this.route('not-found', { path: '/*path' });
});

export default Router;
