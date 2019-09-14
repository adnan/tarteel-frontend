import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from 'react-icons-kit';
import { History } from 'history';
import { circleONotch } from 'react-icons-kit/fa/circleONotch';
import { withCookies } from 'react-cookie';
import { micA } from 'react-icons-kit/ionicons/micA';
import { stop } from 'react-icons-kit/fa/stop';
import { injectIntl, InjectedIntl } from 'react-intl';
import io from 'socket.io-client';

import RecordingButton from '../../components/RecordingButton';
import Navbar from '../../components/Navbar';
import { Container } from './styles';
import { connect } from 'react-redux';
import { setRecognitionResults } from '../../store/actions/recognition';
import RecordingError from '../../components/RecordingError';
import KEYS from '../../locale/keys';
import T from '../../components/T';
import AudioStreamer from '../../helpers/AudioStreamer';
import config from '../../../config';

interface IOwnProps {
  z;
  history: History;
  intl: InjectedIntl;
}

interface IState {
  isRecording: boolean;
  partialQuery: string;
  query: string;
  isLoading: boolean;
  showErrorMessage: boolean;
  errorMessage: JSX.Element;
}

interface IDispatchProps {
  setRecognitionResults(result: any): void;
}

type IProps = IOwnProps & IDispatchProps;

class Recognition extends React.Component<IProps, IState> {
  audioStreamer: any;
  socket: any;

  state = {
    isRecording: false,
    partialQuery: '',
    query: '',
    isLoading: false,
    showErrorMessage: false,
    errorMessage: '',
  };

  handleRecordingButton = async () => {
    if (this.state.isLoading) {
      return;
    } else if (this.state.isRecording) {
      await this.handleStopRecording();
    } else {
      await this.handleStartRecording();
    }
  };

  handleRecordingError = e => {
    this.setState({
      showErrorMessage: true,
    });
    this.handleStopRecording();
  };

  handleStartRecording = async () => {
    // resets the query string with new recordings
    this.setState({
      query: '',
      isRecording: true,
    });

    const options = {
      type: 'recognition',
    };

    this.socket.emit('startStream', options);
    await this.audioStreamer.start();
    this.socket.on('speechData', this.handleData);
  };

  handleResults = async results => {
    if (results.matches.length) {
      await this.handleStopRecording();
      this.props.setRecognitionResults(results);
      this.props.history.push('/recognition/results');
    } else {
      await this.handleStartRecording();
      this.setState({
        isLoading: false,
      });
    }
  };

  handleStopRecording = async () => {
    this.setState({
      isRecording: false,
    });
    this.socket.emit('endStream');
    this.socket.off('speechData');
    this.socket.off('streamError');
    await this.audioStreamer.stop();
  };

  handleData = async data => {
    // TODO: refactor the code with the new api
    this.setState({
      partialQuery: data,
    });
  };

  showErrorMessage = (message: JSX.Element) => {
    this.setState({
      showErrorMessage: true,
      errorMessage: message,
    });
  };

  handleSearch = async () => {
    await this.handleStopRecording();
    this.setState({
      isLoading: true,
    });
  };

  setLoading = (isLoading: boolean) => {
    this.setState({
      isLoading,
    });
  };

  componentDidMount() {
    const speechServerURL = config('recognitionServerURL');
    window.socket = io(speechServerURL);
    this.socket = window.socket;

    this.socket.on('foundResults', this.handleResults);
    this.socket.on('loading', this.setLoading);
    this.socket.on('endStream', async () => {
      await this.handleStopRecording;
    });

    this.audioStreamer = new AudioStreamer(
      data => this.socket.emit('binaryAudioData', data),
      this.handleRecordingError
    );
  }

  async componentWillUnmount() {
    if (this.state.isRecording) {
      await this.handleStopRecording();
    }
  }

  render() {
    const classnames = classNames({
      recording: this.state.isRecording,
    });
    return (
      <Container>
        <Navbar />
        {/* main tag is used for accessibiltiy */}
          <main className={'content'}>
            <div>
              <p className={'status'}>
                <T id={KEYS.AYAH_RECOGNITION_RECOGNITION_MESSAGE} />
              </p>
            </div>
            <div className="words">
              <span className={'query'}>{this.state.query}</span>
              &nbsp;
              <span className="partial-query">
                {this.state.partialQuery}
              </span>
            </div>
            <RecordingButton
              className={`mic ${classnames}`}
              onClick={this.handleRecordingButton}
            >
              {this.state.isLoading ? (
                <div className={'icon spin'}>
                  <Icon icon={circleONotch} size={20} />
                </div>
              ) : !this.state.isRecording ? (
                <Icon icon={micA} size={30} />
              ) : (
                <Icon icon={stop} size={30} />
              )}
            </RecordingButton>
            <p className={'splittable'}>
              <T id={KEYS.AYAH_RECOGNITION_IMPROVE_ACCURACY} />
              &nbsp;
              <br />
              <Link to={'/contribute'}>
                <T id={KEYS.AYAH_RECOGNITION_CONTRIBUTE} />
              </Link>
            </p>
          </main>
          {this.state.showErrorMessage ? (
            <RecordingError
              onClose={() => {
                this.setState({ showErrorMessage: false });
              }}
            />
          ) : null}
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    setRecognitionResults: (result: any) => {
      return dispatch(setRecognitionResults(result));
    },
  };
};

export default injectIntl(
  withCookies(
    connect(
      null,
      mapDispatchToProps
    )(Recognition)
  )
);
