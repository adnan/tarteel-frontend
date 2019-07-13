import React from 'react';
import classNames from 'classnames';
import { History } from 'history';
import { Icon } from 'react-icons-kit';
import { circleONotch } from 'react-icons-kit/fa/circleONotch';
import { refresh } from 'react-icons-kit/fa/refresh';
import { gear } from 'react-icons-kit/fa/gear';

import { enter } from 'react-icons-kit/iconic/enter';
import { exit } from 'react-icons-kit/iconic/exit';
import _ from 'lodash';
import Helmet from 'react-helmet';
import { withCookies } from 'react-cookie';
import { micA } from 'react-icons-kit/ionicons/micA';
import { stop } from 'react-icons-kit/fa/stop';
import { loadNextAyah } from '../../store/actions/ayahs';
import { injectIntl, InjectedIntl } from 'react-intl';
import AudioStreamer from '../../helpers/AudioStreamer';
import TranscribeAyah from './TranscribeAyah';
import RecordingButton from '../../components/RecordingButton';
import Navbar from '../../components/Navbar';
import { Container } from './styles';
import humps from 'humps';
import { connect } from 'react-redux';

import ReduxState from '../../types/GlobalState';
import { setRecognitionResults } from '../../store/actions/recognition';
import config from '../../../config';
import RecordingError from '../../components/RecordingError';
import KEYS from '../../locale/keys';
import T from '../../components/T';
import Fullscreen from 'react-full-screen';
import io from 'socket.io-client';
import Socket = SocketIOClient.Socket;
import IAyahShape from '../../shapes/IAyahShape';
import { fetchSpecificAyah } from '../../api/ayahs';

interface IOwnProps {
  history: History;
  intl: InjectedIntl;
  voiceServer: string;
  nextAyah: IAyahShape;
}

interface IState {
  isRecording: boolean;
  partialQuery: string;
  query: string; // TODO: Is this used?
  isLoading: boolean;
  showErrorMessage: boolean;
  errorMessage: JSX.Element;
  fullScreen: boolean;
  currentAyah: IAyahFound;
  previousAyahs: IAyahShape[];
  currentTranscribedIndex?: number;
  ayahFound: boolean;
}

interface IStateProps {
  nextAyah: IAyahShape;
}

interface IDispatchProps {
  setRecognitionResults(result: any): void;
  loadNextAyah(currentAyah: IAyahShape): void;
}

interface ISpeechResult {
  text: string;
  isFinal: boolean;
}

type IProps = IOwnProps & IDispatchProps & IStateProps;

interface IAyahFound {
  ayahNum: number;
  surahNum: number;
  ayahWords: string[];
}

interface IMatchFound {
  ayahNum: number;
  surahNum: number;
  wordCount: number;
}

interface ISpeechResult {
  text: string;
  isFinal: boolean;
}

const DEBUG = true;

class Transcribe extends React.Component<IProps, IState> {
  audioStreamer: any;
  socket: Socket;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isRecording: false,
      partialQuery: '',
      query: '',
      isLoading: false,
      showErrorMessage: false,
      errorMessage: React.createElement('div'),
      fullScreen: false,
      currentAyah: null,
      currentTranscribedIndex: 0,
      previousAyahs: [],
      ayahFound: false,
    };
  }

  handleError = (message: JSX.Element) => {
    /** Activate the modal displaying the error message. */
    console.error(`TRANSCRIBE ERROR: ${message.props}`);
    this.setState({
      showErrorMessage: true,
      errorMessage: message,
    });
  };

  toggleFullscreen = () => {
    this.setState({
      fullScreen: !this.state.fullScreen,
    });
  };

  handleStartRecording = async () => {
    if (DEBUG) {
      console.log('TRANSCRIBE: Starting recording');
    }
    this.setState({
      query: '',
      isRecording: true,
      isLoading: true,
    });

    const options = {
      type: 'transcribe',
    };
    this.socket.emit('startStream', options);
    await this.audioStreamer.start();
    this.socket.emit('speechResult', this.handleResult);
    this.setState({ isLoading: false });
  };

  handleStopRecording = async () => {
    if (DEBUG) {
      console.log('TRANSCRIBE: Stop recording');
    }
    this.socket.emit('endStream');
    this.socket.off('speechResult');
    this.socket.off('streamError');
    await this.audioStreamer.stop();
    this.setState({
      isRecording: false,
    });
  };

  handleRecordingButton = async () => {
    if (DEBUG) {
      console.log(
        `TRANSCRIBE: Recording button clicked. isLoading: ${
          this.state.isLoading
        }`
      );
    }
    if (this.state.isLoading) {
      return;
    } else if (this.state.isRecording) {
      await this.handleStopRecording();
    } else {
      await this.handleStartRecording();
    }
  };

  handleRecognitionError = (event: any) => {
    if (DEBUG) {
      console.log('ERROR: Recognition', event);
    }
    this.handleStopRecording();
    const errorLink = '//support.google.com/websearch/answer/2940021';
    const chromeLink = '//support.google.com/chrome/answer/2693767';
    if (event.error === 'no-speech') {
      this.handleError(
        <p>
          <T
            id={KEYS.AYAH_RECOGNITION_NO_SPEECH_ERROR}
            values={{ errorLink }}
          />
        </p>
      );
    } else if (event.error === 'audio-capture') {
      this.handleError(
        <p>
          <T
            id={KEYS.AYAH_RECOGNITION_AUDIO_CAPTURE_ERROR}
            values={{ errorLink }}
          />
        </p>
      );
    } else if (event.error === 'not-allowed') {
      this.handleError(
        <p>
          <T
            id={KEYS.AYAH_RECOGNITION_MIC_PERMISSION_ERROR}
            values={{ chromeLink }}
          />
        </p>
      );
    }
  };

  handleOGImage = () => {
    const locale = this.props.cookies.get('currentLocale') || 'en';
    return `/public/og/recognition_${locale}.png`;
  };

  handleMatchFound = async ({ ayahNum, surahNum, wordCount }: IMatchFound) => {
    if (DEBUG) {
      console.log(
        `TRANSCRIBE EVENT: Match Found. surahNum: ${surahNum}, ayahNum: ${ayahNum}, wordCount: ${wordCount}`
      );
    }
    this.setState({ currentTranscribedIndex: wordCount - 1 });
    const { currentAyah, previousAyahs } = this.state;
    // don't fetch the same ayah everytime
    const ayah = await fetchSpecificAyah(surahNum, ayahNum);

    if (
      currentAyah.surahNum === surahNum &&
      currentAyah.ayahNum === ayahNum &&
      wordCount === ayah.words.length - 1
    ) {
      this.setState(
        {
          currentTranscribedIndex: 0,
          previousAyahs: [...previousAyahs, humps.camelizeKeys(ayah)],
        },
        async () => {
          await this.props.loadNextAyah(humps.camelizeKeys(ayah));
        }
      );
    }
  };

  handleAyahFound = async (currentAyah: IAyahFound) => {
    if (DEBUG) {
      console.log(
        `TRANSCRIBE EVENT: Ayah Found. surahNum: ${
          currentAyah.surahNum
        } ayahNum: ${currentAyah.ayahNum}`
      );
    }
    this.setState({ currentAyah, ayahFound: true });
  };

  handleResult = (result: ISpeechResult) => {
    /**
     * Updates the state of the string displayed on the page as data comes in from the GCloud backend.
     * Only displays if no ayah is found.
     * @param data - ISpeechResult type.
     */
    if (DEBUG) {
      console.log(
        `TRANSCRIBE EVENT: Speech Result. result: ${result.text}, isFinal: ${
          result.isFinal
        }`
      );
    }
    const { ayahFound, partialQuery } = this.state;
    const { text } = result;
    this.setState({ partialQuery: text });
  };

  resetState = async () => {
    // @ts-ignore
    this.setState({
      partialQuery: '',
      previousAyahs: [],
      showErrorMessage: false,
      errorMessage: React.createElement('div'),
      isLoading: false,
      ayahFound: false,
      currentAyah: {},
    });
    await this.handleStopRecording();
  };

  componentDidMount() {
    /** Setup sockets and audio streamer. */
    this.setState({
      query: '',
    });

    const speechServerURL = config('transcribeServerURL');
    this.socket = io(speechServerURL);
    // Partial/Final Transcripts from Google
    this.socket.on('speechResult', this.handleResult);
    // Returns, surah/ayah number with word
    this.socket.on('ayahFound', this.handleAyahFound);
    // Update the state of read ayahs
    this.socket.on('matchFound', this.handleMatchFound);
    this.socket.on('streamError', this.handleRecognitionError);
    this.socket.on('endStream', this.handleStopRecording);

    this.audioStreamer = new AudioStreamer(
      data => this.socket.emit('sendStream', data),
      this.handleRecognitionError
    );
  }

  async componentWillUnmount() {
    await this.handleStopRecording();
  }

  renderFinishedAyahs = () =>
    _.takeRight(this.state.previousAyahs, 4).map((currAyah: IAyahShape) => (
      <TranscribeAyah key={currAyah.id} isTranscribed={true} ayah={currAyah} />
    ));

  render() {
    const classnames = classNames({
      recording: this.state.isRecording,
    });
    const ogTitle = this.props.intl.formatMessage({
      id: KEYS.TRANSCRIBE,
    });
    return (
      <Container>
        <Helmet>
          <title>{ogTitle}</title>
          <meta property={'og:image'} content={this.handleOGImage()} />
          <meta name={'twitter:image'} content={this.handleOGImage()} />
        </Helmet>
        <Navbar />
        {/* Show error message modal. */}
        {this.state.showErrorMessage && (
          <RecordingError
            message={this.state.errorMessage}
            onClose={() => {
              this.setState({ showErrorMessage: false });
            }}
          />
        )}
        <Fullscreen
          enabled={this.state.fullScreen}
          onChange={fullScreen => this.setState({ fullScreen })}
        >
          <div className="header-container">
            <div className="icons-container">
              <Icon
                className="icon fullscreen-icon"
                icon={this.state.fullScreen ? exit : enter}
                onClick={this.toggleFullscreen}
              />
              <Icon className="icon" icon={refresh} onClick={this.resetState} />
              <Icon className="icon" icon={gear} />
            </div>
          </div>

          {this.state.ayahFound ? (
            <div className="ayah-info">
              <span className="surah-name">
                Surah {this.state.currentAyah.surahNum}{' '}
              </span>
              <span className="ayah-number">
                Ayah {this.state.currentAyah.ayahNum}{' '}
              </span>
            </div>
          ) : (
            <div className="ayah-info">Waiting for input...</div>
          )}

          <div className="finished-ayahs">
            {this.renderFinishedAyahs()}
            {this.props.nextAyah &&
              this.props.nextAyah.chapterId ===
                this.state.currentAyah.surahNum && (
                <TranscribeAyah
                  ayah={this.props.nextAyah}
                  isTranscribed={false}
                  currentTranscribedIndex={this.state.currentTranscribedIndex}
                />
              )}
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
          <div>
            <a className="donate-link" href="https://tarteel.io/donate">
              tarteel.io/donate
            </a>
          </div>
        </Fullscreen>
      </Container>
    );
  }
}

const mapStateToProps = (state: ReduxState): IStateProps => {
  return {
    nextAyah: state.ayahs.nextAyah.reverse()[0],
  };
};

const mapDispatchToProps = (dispatch): IDispatchProps => {
  return {
    setRecognitionResults: (result: any) => {
      return dispatch(setRecognitionResults(result));
    },
    loadNextAyah: (ayah: IAyahShape) => dispatch(loadNextAyah(ayah)),
  };
};

export default injectIntl(
  withCookies(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Transcribe)
  )
);
