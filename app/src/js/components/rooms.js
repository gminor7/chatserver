/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');

var Rooms = React.createClass({
    getInitialState: function() {
      return { rooms:[], username:''};
    },
    componentWillMount: function(){
      AppStore.addRoomChangeListener(this._onChange);
      //this._getCurrentLocation();
    },
    _onChange: function() {
      var tmp = AppStore.getRooms();
      this.setState({rooms:tmp});
    },
    componentDidUpdate:function(){
      $(document).foundation();
    },
    render:function(){
      var that = this;
      return (
        <ul className="accordion" data-accordion>
          {this.state.rooms.map(function(data,index){
            var id = 'panel'+index+'a';
            var link ='#'+id; 
            return (<li key={index} className="accordion-navigation">
                      <a href={link} onClick={that._enterRoom.bind(that,data)}>{data}</a>
                      <div id={id} className="content">
                        Users list goes here.
                      </div>
                    </li>)
          })}
        </ul>
      )
    },
    _enterRoom: function(room) {
      console.log(room)
      if(this.state.username == '') {
        var username = prompt('please enter a username.');
        AppActions.enterRoom(room,username);
        this.setState({username:username});
      } else {
        AppActions.enterRoom(room,this.state.username);
      }
    }
  });

module.exports = Rooms;
