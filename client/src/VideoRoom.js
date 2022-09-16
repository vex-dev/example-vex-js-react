import React from 'react';
import Video from './Video';
import MyVideo from './MyVideo';

export default class VideoRoom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      joinStatus: "unjoined",
      peersInRoom: {},
      sendingVideo: false,
      myVideoStream: null
    }
    // peersInRoom is a map (JS object) containing:
    // {
    //   peer-id: {
    //      peer: Vex Peer object
    //      stream: MediaStream object
    //   }
    // }
  }

  onPeerJoined(peer) {
    const vexRoom = this;
    // WARNING: onPeerJoined can be called before the Promise returned by joinRoom resolves.
    vexRoom.receiveMediaFrom(peer.id);
  }

  setPeerState(peerState) {
    this.setState((state, props) => {
      const peersInRoom = state.peersInRoom
      peersInRoom[peerState.peer.id] = peerState
      return { peersInRoom }
    });
  }

  onPeerMedia(peer, stream) {
    this.setPeerState({ peer, stream })
  }

  onPeerLeft(peer) {
    this.setState((state, props) => {
      const peersInRoom = state.peersInRoom
      delete peersInRoom[peer.id]
      return { peersInRoom }
    });
  }

  joinVexRoom(roomId) {
    const jwt = window.vex_jwt;

    this.setState({ joinStatus: "joining..." })
    const vexRoomConfig = {
      displayName: "React Example",
      onPeerJoined: this.onPeerJoined,
      onPeerMedia: (peer, stream) => { this.onPeerMedia(peer, stream) },
      onPeerLeft: (peer) => { this.onPeerLeft(peer) }
    }
    this.props.conn.joinRoom(roomId, jwt, vexRoomConfig)
      .then(vexRoom => {
        this.setState({ joinStatus: "succeeded", vexRoom })
      })
      .catch(error => {
        this.setState({ joinStatus: "failed" });
      })
  }

  getMyVideoStream() {
    this.props.vex.getMedia({
      audio: true,
      video: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 400, ideal: 1080 }
      }
    }).then(myVideoStream => {
      this.setState({ myVideoStream });
    })
  }

  async componentDidMount() {
    this.joinVexRoom(this.props.roomId);
    this.getMyVideoStream();
  }

  render() {
    return (
      <div className='video-room'>
        <div className='room-control'>
          <p>Room {this.props.roomId}</p>
          <p>Join: {this.state.joinStatus}</p>
        </div>
        <MyVideo room={this.state.vexRoom} stream={this.state.myVideoStream} />
        <div className='spacer' />
        <div className='video-grid'>
          {Object.values(this.state.peersInRoom).map(peerInfo =>
            <PeerVideoSquare key={peerInfo.peer.id}
              stream={peerInfo.stream}
              name={peerInfo.peer.displayName} />
          )}
        </div>
      </div>
    )
  }
}

class PeerVideoSquare extends React.Component {
  render() {
    return (
      <div className='peer-video'>
        <Video stream={this.props.stream} />
        <p className='peer-name'>{this.props.name}</p>
      </div>
    );
  }
}
