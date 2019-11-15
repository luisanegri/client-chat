import React, { Component } from 'react';
import superagent from 'superagent';
import { url } from './constants';

export default class Room extends Component {
  state = {
    messages: [],
    value: ''
  };

  // connect to the string
  stream = {};
  //

  componentDidMount = () => {
    const { name } = this.props.match.params;
    const url3 = `${url}/streams/${name}`;
    this.stream = new EventSource(url3);

    this.stream.onmessage = event => {
      //destructure the data (what was passed to stream.send)
      const { data } = event;
      console.log(data);
      // console.log('create array', ['x']);
      // convert the serialised string back into javascript data
      const parsed = JSON.parse(data);
      // check if the sent data is an array
      if (Array.isArray(parsed)) {
        // if it is *we assume it contains all messages,
        // and replace the full list in the state
        this.setState({ messages: parsed });
      } else {
        // if it is not we assume it is a single message
        // and add it at the end of the list
        const messages = [...this.state.messages, parsed];
        // replace the old list with the extended list
        this.setState({ messages });
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
    const { name } = this.props.match.params;
    const url4 = `${url}/message/${name}`;
    superagent
      .post(url4)
      .send({ message: value })
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
        {this.state.messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </div>
    );
  }
}
