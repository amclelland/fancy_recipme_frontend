// import Model from 'ember-data/model';
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

// export default Model.extend({
//   name: attr('string'),
//   image: attr('string')
// });

import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  quantity: DS.attr('number'),
  quantity_units: DS.attr('string'),
  listable: DS.belongsTo('listable', { polymorphic: true, async: true })
});
