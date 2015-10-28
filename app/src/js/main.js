/** @jsx React.DOM */
var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
var ReactDom = require('react-dom');
var App = require('./components/app.js');
var Landing = require('./components/landing.js');

ReactDom.render((
  <Router>
    <Route path="/" component={App}>
    	<IndexRoute component={Landing} />
    </Route>
  </Router>
), document.getElementById('main'))