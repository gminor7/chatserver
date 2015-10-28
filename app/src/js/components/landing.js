/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');
const Jobs = require('./joblines.js');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Landing = React.createClass({
    style: {
      margin:'auto',
      width:'90%',
      marginTop:'20px',
      textAlign:'center',

    },
    getInitialState: function() {
      return { msgs:[] };
    },
    componentWillMount: function(){
      AppStore.addChangeListener(this._onChange);
      //this._getCurrentLocation();
    },
    _onChange: function() {
      var tmp = AppStore.getMsgs();
      this.setState({msgs:tmp});
    },
    componentDidUpdate: function() {
      var objDiv = document.getElementById("chatMsgs");
      objDiv.scrollTop = objDiv.scrollHeight;
    },
    _sendMsg: function(e) {
      e.preventDefault();
      AppActions.sndMsg(e.target.firstElementChild.value);
      e.target.firstElementChild.value = '';
      return false;
    },
    render:function(){
      var h = $(window).height()-100;

      return (
          <div style={{height:'100%'}}>
            <div className="small-8 small-centered columns" style={{height:h+'px','overflowY':'scroll',display:'table'}}>
              <div style={{display:'table-cell','verticalAlign':'bottom',height:'100%'}}>
              <div id="chatMsgs" style={{'maxHeight':h+'px','overflowY':'scroll'}}>
              {this.state.msgs.map(function(data,index){
                return (<div className="alert-box success" key={index}>
                          <strong>{data.username}:</strong> {data.msg}
                        </div>);
              })}
              </div>
              </div>
            </div>
            <div className="small-8 small-centered columns">
              <form onSubmit={this._sendMsg}>
                <input type="text" className="large-8 columns radius"/>
                <button type="submit" className="button radius tiny right">Send</button>
              </form>
            </div>
          </div>
        
      )
    }
  });

module.exports = Landing;


