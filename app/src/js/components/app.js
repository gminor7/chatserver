var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');
const Rooms = require('./rooms.js');
const Users = require('./users.js');

var App = React.createClass({
    render:function(){
    	var style = {
    		position:'absolute',
    		top:0,
    		left:0,
    		width:'100%',
    		height:'100%',
    		color:'white'

    	}
      return (
        <div className="row">
          <div className="large-4 columns">
            <Rooms/>
          </div>
          <div className="large-8 columns">
            {this.props.children}
          </div>
        </div>
      )
    },
    msg:function(e) {

    }
});

module.exports = App;
