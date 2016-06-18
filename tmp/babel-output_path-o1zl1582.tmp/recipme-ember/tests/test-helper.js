define('recipme-ember/tests/test-helper', ['exports', 'recipme-ember/tests/helpers/resolver', 'ember-qunit'], function (exports, _recipmeEmberTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_recipmeEmberTestsHelpersResolver['default']);
});