define('recipme-ember/models/meal', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _emberDataModel, _emberDataAttr) {
  // import { belongsTo, hasMany } from 'ember-data/relationships';

  exports['default'] = _emberDataModel['default'].extend({
    name: (0, _emberDataAttr['default'])('string'),
    image: (0, _emberDataAttr['default'])('string')
  });
});