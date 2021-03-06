import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('meals', function() {
    this.route('index', { path: '/' }, function(){
      this.route('new');
    });
    this.route('show', { path: ':meal_id' });
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
