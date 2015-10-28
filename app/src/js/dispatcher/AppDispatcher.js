var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var AppDispatcher = assign(new Dispatcher(), {
  handleViewAction: function(action) {
    this.dispatch({
      source: 'UPDATE_ACTION',
      action: action
    });
  },
  handleErrorAction: function(action) {
    this.dispatch({
      source: 'ERROR_ACTION',
      action: action
    });
  }
});

module.exports = AppDispatcher;
