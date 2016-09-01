// import Model from 'ember-data/model';
// import attr from 'ember-data/attr';
// import { hasMany } from 'ember-data/relationships';

// export default Model.extend({
//   name: attr('string'),
//   image: attr('string'),
//   ingredients: hasMany('ingredient')
// });

import Listable from './listable';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Listable.extend({
  name: attr('string'),
  image: attr('string'),
  ingredients: hasMany('ingredient', { async: true })
});
