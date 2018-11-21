import { Component } from 'react';

class Test extends Component {
  componentDidMount() {}
  render() {
    console.log(this.props);
    return <div>Test1</div>;
  }
}

export default Test;
