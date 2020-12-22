import axios from 'axios';
import { message } from 'antd';
import URL from '../assets/constant/url';
const WebRTCAdaptor = window.WebRTCAdaptor;

class Streamer {
  // webrtc constraints
  _pcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  _sdpConstraints = { OfferToReceiveAudio: false, OfferToReceiveVideo: false };
  _mediaConstraints = {
    video: { aspectRatio: 16 / 9 },
    audio: true,
  };
  _playOnly = false;
  webRTCAdaptor = null; // adapter object
  roomOfStream = [];
  streamList = [];
  isMuted = false;
  isVideoPaused = false;
  isScreenShared = false;

  // jwt token
  token = '';
  // user session details
  userDetails = {};
  // check for teacher
  isTeacher = true;

  // state based handlers
  chat = [];
  setChat;

  constructor(token, userDetails) {
    this.token = token;
    this.userDetails = userDetails;
    this.isTeacher = userDetails.role === 'Teacher';
  }

  // used for messgae Id
  _uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  initAdapter = () => {
    this.webRTCAdaptor = new WebRTCAdaptor({
      websocket_url: URL.WSS,
      mediaConstraints: this._mediaConstraints,
      peerconnection_config: this._pcConfig,
      sdp_constraints: this._sdpConstraints,
      localVideoId: `remoteVideo-${this.userDetails.stream_id}`,
      isPlayMode: this._playOnly,
      debug: false,
      callback: this._successCallBack,
      callbackError: this._initError,
    });
  };

  toggleMute = () => {
    if (this.isMuted) {
      this.webRTCAdaptor.unmuteLocalMic();
    } else {
      this.webRTCAdaptor.muteLocalMic();
    }
    this.isMuted = !this.isMuted;
  };

  toggleVideoCamera = () => {
    if (this.isVideoPaused) {
      this.webRTCAdaptor.turnOnLocalCamera();
    } else {
      this.webRTCAdaptor.turnOffLocalCamera();
    }
    this.isVideoPaused = !this.isVideoPaused;
  };

  shareScreen = () => {
    if (this.isScreenShared) {
      this.webRTCAdaptor.switchVideoCameraCapture(this.userDetails.stream_id);
    } else {
      this.webRTCAdaptor.switchDesktopCaptureWithCamera(
        this.userDetails.stream_id
      );
    }
    this.isScreenShared = !this.isScreenShared;
  };

  joinRoom = () => {
    try {
      this.webRTCAdaptor.joinRoom(
        this.userDetails.room_id,
        this.userDetails.stream_id
      );
    } catch (e) {
      alert('unable to connect');
    }
  };

  leaveRoom = () => {
    this.webRTCAdaptor.leaveFromRoom(this.userDetails.room_id);
    this.webRTCAdaptor.unmuteLocalMic();
    this.webRTCAdaptor.turnOnLocalCamera();

    axios
      .post(
        URL.UPDATE_ROOM_DETAILS,
        { room_id: this.userDetails.room_id },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => {
        console.log('updated room details');
      })
      .catch((error) => {
        console.log('leaveRoom: Err - ', error);
      });

    setTimeout(() => window.close(), 1000);
  };

  setChatHandlers = (setChat) => {
    this.setChat = setChat;
  };

  sendChat = (value) => {
    try {
      const messageObject = {
        messageId: this._uuidv4(),
        messageDate: new Date().getTime(),
        messageBody: value,
        name: this.userDetails.name,
      };

      this.streamList.forEach((item) => {
        this.webRTCAdaptor.sendData(item, JSON.stringify(messageObject));
      });

      this.chat = [...this.chat, messageObject];
      this.setChat(this.chat);
    } catch (e) {
      console.log(e);
      message.error({ content: 'Unable to send message' });
    }
  };

  raiseHand = () => {
    try {
      let message = { ...this.userDetails, isRaisedHand: true };
      message = JSON.stringify(message);
      this.streamList.forEach((item) => {
        this.webRTCAdaptor.sendData(item, message);
      });
    } catch (e) {
      console.log(e);
      message.error({ content: 'Unable to send message' });
    }
  };

  _successCallBack = (info, obj) => {
    // console.log('## status ##', info);
    let elm = null;

    switch (info) {
      case 'initialized': // nothing for now
        break;
      case 'joinedTheRoom':
        this._onRoomJoin(obj);
        break;
      case 'streamJoined':
        // [current users on stream (playing video) joining]
        console.debug('## stream joined with id ' + obj.streamId + ' ##');
        this._updatelog(obj);
        this.streamList.push(obj.streamId);
        this.webRTCAdaptor.play(obj.streamId, this.token, this.room_id);
        break;
      case 'newStreamAvailable':
        // [student on room joining]
        console.log('## new user joined ##', obj);
        elm = document.getElementById('online-' + obj.streamId);
        if (elm) elm.classList.add('online');
        this._playVideo(obj);
        break;
      case 'streamLeaved':
        // [on room leaving]
        console.debug('## user left with ID ## ' + obj.streamId);
        elm = document.getElementById('online-' + obj.streamId);
        if (elm) elm.classList.remove('online');
        this.streamList.splice(this.streamList.indexOf(obj.streamId), 1);
        this._updatelog(obj);
        this._removeRemoteVideo(obj.streamId);
        break;
      case 'publish_started':
        // stream is being published [teacher strated video]
        console.log(`publish started room: ${this.roomOfStream[obj.streamId]}`);
        break;
      case 'leavedFromRoom':
        // @TODO: implement room left
        console.log(`## left from room ##`);
        break;
      case 'closed':
        // @TODO: implement closed connection
        console.log(`## connection closed ##`);
        break;
      case 'play_finished':
        // @TODO: stop video on play_finished [nullify src]
        console.log(`## connection closed ##`);
        break;
      case 'streamInformation':
        this.webRTCAdaptor.play(
          obj.streamId,
          this.token,
          this.userDetails.room_id
        );
        break;
      case 'data_channel_opened':
        // isDataChannelOpen = false;
        console.log(`## dataChannel opened for stream id ##`, obj);
        break;
      case 'data_received':
        // @TODO: implement message recieve
        console.log(`## message recieved ##`, obj);
        const received_text = JSON.parse(obj.event.data);
        if (received_text.isRaisedHand) {
          message.info({
            content: `${received_text.name} have doubts`,
            key: 'doubt',
          });
        } else {
          this._handleReceivedMessage(obj);
        }
        break;
      case 'data_channel_error':
        console.log('## dataChannel error ##');
        break;
      default:
        // nothing
        break;
    }
  };

  _onRoomJoin = (obj) => {
    console.log('## JOIN ROOM ##', obj);
    this.roomOfStream[obj.streamId] = obj['ATTR_ROOM_NAME'];
    // publishing on webrtc adapter
    if (!this._playOnly) this.webRTCAdaptor.publish(obj.streamId, this.token);
    // already eneterd users [before current user enter]
    if (obj.streams != null) {
      obj.streams.forEach((item) => {
        this.streamList.push(item);
        this.webRTCAdaptor.play(item, this.token, this.userDetails.room_id);
      });
    }
  };

  _handleReceivedMessage = (obj) => {
    const msg = JSON.parse(obj.event.data);
    this.chat = [...this.chat, msg];
    this.setChat(this.chat);
  };

  _initError = (error, message) => {
    let errorMessage = JSON.stringify(error);
    if (typeof message !== 'undefined') {
      errorMessage = message;
    }

    if (error.indexOf('NotFoundError') !== -1) {
      errorMessage =
        'Camera or Mic are not found or not allowed in your device.';
    } else if (
      error.indexOf('NotReadableError') !== -1 ||
      error.indexOf('TrackStartError') !== -1
    ) {
      errorMessage =
        'Camera or Mic is being used by some other process that does not not allow these devices to be read.';
    } else if (
      error.indexOf('OverconstrainedError') !== -1 ||
      error.indexOf('ConstraintNotSatisfiedError') !== -1
    ) {
      errorMessage =
        'There is no device found that fits your video and audio constraints. You may change video and audio constraints.';
    } else if (
      error.indexOf('NotAllowedError') !== -1 ||
      error.indexOf('PermissionDeniedError') !== -1
    ) {
      errorMessage = 'You are not allowed to access camera and mic.';
    } else if (error.indexOf('TypeError') !== -1) {
      errorMessage = 'Video/Audio is required.';
    } else if (error.indexOf('UnsecureContext') !== -1) {
      errorMessage =
        'Fatal Error: Browser cannot access camera and mic because of unsecure context. Please install SSL and access via https';
    } else if (error.indexOf('WebSocketNotSupported') !== -1) {
      errorMessage = 'Fatal Error: WebSocket not supported in this browser';
    } else if (error.indexOf('no_stream_exist') !== -1) {
      // @TODO: removeRemoteVideo(error.streamId);
    } else if (error.indexOf('data_channel_error') !== -1) {
      errorMessage = 'There was a error during data channel communication';
    }

    alert(message);
  };

  _updatelog = (obj) => {
    var data = {
      room_id: obj.ATTR_ROOM_NAME,
      stream_id: obj.streamId,
      flag: obj.definition,
    };
    // updating api logs
    axios
      .post(URL.UPDATE_LOGS, data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => console.log('updateLogs: Success'))
      .catch((error) => console.log('updateLogs: Err - ', error));
  };

  /**
   * Start Playing Video of Each Student / Teacher
   * @param {*} obj Object from stream
   */
  _playVideo = (obj) => {
    console.log(`new stream available => id: ${obj.streamId}`);
    // const room = this.roomOfStream[obj.streamId];
    let userVideo = document.getElementById(`remoteVideo-${obj.streamId}`);
    if (userVideo) userVideo.srcObject = obj.stream;
  };

  /**
   * Nullifies Video src on student left
   * @TODO: see if it can be removed
   * @param {*} streamId
   */
  _removeRemoteVideo = (streamId) => {
    // var video = document.getElementById('remoteVideo' + streamId);
    // if (video != null) {
    //   var player = document.getElementById('player' + streamId);
    //   video.srcObject = null;
    //   document.getElementById('players').removeChild(player);
    // }
  };
}
export default Streamer;
