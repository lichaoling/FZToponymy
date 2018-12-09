import { Component } from 'react';
import { Steps } from 'antd';

const Step = Steps.Step;

class FlowViewer extends Component {
  state = {
    current: 0,
    flow: [],
  };

  getFlow() {
    let { id, getWorkflow } = this.props;
    if (id && getWorkflow) {
      getWorkflow({ id: id }, e => {
        let flow = e;
        let current = flow.length;
        for (let i = 0; i < flow.length - 1; i++) {
          if (flow[i].ISFINISH != flow[i + 1].ISFINISH) {
            current = i + 1;
            break;
          }
        }
        this.setState({ current: current, flow: flow });
      });
    }
  }

  componentDidMount() {
    this.getFlow();
  }
  render() {
    let { current, flow } = this.state;
    return (
      <div style={{ height: 300, width: 200, overflow: 'auto' }}>
        <Steps direction="vertical" current={current}>
          {flow.map(i => (
            <Step title={i.FLOWNODENAME} description={i.FLOWNODEPROCESSOR} />
          ))}
        </Steps>
      </div>
    );
  }
}

export default FlowViewer;
