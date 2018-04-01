// @flow

import * as React from 'react';

type props = {
  interval: number,
  children: () => React.Node,
};

type state = {
  next: number,
};

export default class Interval extends React.Component<props, state> {
  intervalID: IntervalID;

  state = { next: 0 };

  constructor(props: props, context: any) {
    super(props, context);
    this.intervalID = setInterval(() => {
      this.setState({ next: this.state.next + 1 });
    }, props.interval);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    return this.props.children.call(null);
  }

  static defaultProps = {
    interval: 1000,
  };
}
