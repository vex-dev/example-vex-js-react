import React from 'react';
import './App.css';
import { Vex } from '@vex.dev/web-sdk';
import VideoRoom from './VideoRoom';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connectionStatus: "disconnected",
      vexInstance: null,
      conn: null,
      roomId: window.vex_room_id
    };
  }

  componentDidMount() {
    this.connectToVex();
  }

  connectToVex() {
    const vex = new Vex({
      url: window.vex_server_url,
      onDisconnect: () => { this.onVexDisconnect() }
    });
    this.setState({ vexInstance: vex, connectionStatus: "connecting..." });
    vex.connect().then(conn => { this.onVexConnect(conn) });
  }

  onVexConnect(conn) {
    this.setState({ connectionStatus: "connected", conn })
  }

  onVexDisconnect() {
    this.setState({ connectionStatus: "disconnected" })
  }

  render() {
    return (
      <div className='video-app'>
        <p>Vex: {this.state.connectionStatus}</p>
        {this.state.connectionStatus === "connected" &&
          <VideoRoom roomId={this.state.roomId}
            vex={this.state.vexInstance}
            conn={this.state.conn} />
        }
      </div>
    )
  }
}

export default App;
