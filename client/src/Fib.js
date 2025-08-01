import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {

  constructor (props){
    super(props);

    this.state = {
      seenIndexes: [],
      values: {},
      index: '',
    };
    this.fetchValues = this.fetchValues.bind(this);
    this.fetchIndexes = this.fetchIndexes.bind(this);
    this.handleFetchValuesAndIndexes = this.handleFetchValuesAndIndexes.bind(this);
  }



  componentDidMount() {
    this.handleFetchValuesAndIndexes();
  }

  handleFetchValuesAndIndexes() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({ values: values.data });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({
      seenIndexes: seenIndexes.data,
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/api/values', {
      index: this.state.index,
    });
    this.setState({ index: '' });
    this.handleFetchValuesAndIndexes();
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
        <button onClick={this.handleFetchValuesAndIndexes}>Get Updated values</button>
      </div>
    );
  }
}

export default Fib;
