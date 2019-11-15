import React, { Component } from 'react';
import superagent from 'superagent';
import { Link } from 'react-router-dom';

export default class Rooms extends Component {
  state = {
    rooms: [],
    value: ''
  };

  // connect to the string
  stream = new EventSource('http://localhost:4000/stream');

  componentDidMount = () => {
    //
    this.stream.onmessage = event => {
      //destructure the data (what was passed to stream.send)
      const { data } = event;
      // console.log('create array', ['x']);
      // convert the serialised string back into javascript data
      const parsed = JSON.parse(data);
      // check if the sent data is an array
      if (Array.isArray(parsed)) {
        // if it is *we assume it contains all messages,
        // and replace the full list in the state
        this.setState({ rooms: parsed });
      } else {
        // if it is not we assume it is a single message
        // and add it at the end of the list
        const rooms = [...this.state.rooms, parsed];
        // replace the old list with the extended list
        this.setState({ rooms });
      }
    };
  };

  // trigger when someting change in the input
  onChange = event => {
    // get the value from event
    const { value } = event.target;
    this.setState({ value });
  };

  // submit value to the state when clicking the button
  onSubmit = event => {
    event.preventDefault();
    const { value } = this.state;
    const url = 'http://localhost:4000/room';
    superagent
      .post(url)
      .send({ name: value })
      .then(res => console.log('res', res));
    this.reset();
  };

  reset = () => {
    this.setState({ value: '' });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          {/* using onchange function in input makes the value show up on component when typing something new*/}
          {/* the value attribute makes clear the value on the form when reseting it, it shows what is in the state*/}
          <input
            type="text"
            onChange={this.onChange}
            value={this.state.value}
          />
          <button type="button" onClick={this.reset}>
            Reset
          </button>
          <button>Submit</button>
        </form>
        {this.state.rooms.map((name, index) => (
          <li key={index}>
            <Link to={`/room/${name}`}>{name}</Link>
          </li>
        ))}
      </div>
    );
  }
}
