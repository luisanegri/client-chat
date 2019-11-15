import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Rooms from './Rooms';
import Room from './Room';

export default class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Rooms} />
        <Route path="/room/:name" component={Room} />
      </div>
    );
  }
}
