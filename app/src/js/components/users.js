/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');

var Users = React.createClass({
    getInitialState: function() {
      return { users:[]};
    },
    componentWillMount: function(){
      //AppStore.addRoomChangeListener(this._onChange);
      //this._getCurrentLocation();
    },
    _onChange: function() {
      var tmp = AppStore.getRooms();
      //this.setState({users:tmp});
    },
    render:function(){
      var style = {
        "height":"400px"
      };
      var style1 = {"fontSize":"250px"};
      return (
        <section className="block-list">
          <header>Users in this room.</header>
          <ul>
            {this.state.users.map(function(data,index){
              return (<li key={index}><a href="#">{data}</a></li>)
            })}
          </ul>
        </section>
      )
    }
  });

module.exports = Users;
