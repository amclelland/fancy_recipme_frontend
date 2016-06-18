define('recipme-ember/controllers/meals', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    isShowingModal: false,
    actions: {
      toggleModal: function toggleModal() {
        this.toggleProperty('isShowingModal');
      }
    }
  });
});