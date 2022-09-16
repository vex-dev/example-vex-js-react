import React from 'react';

export default class Video extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    const node = this.myRef.current;
    node.srcObject = this.props.stream;
  }

  render() {
    return (
      <video
        ref={this.myRef}
        autoPlay
        playsInline
        controls
      />
    )
  }
}
