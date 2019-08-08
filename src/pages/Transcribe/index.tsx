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
import { loadNextAyah, clearNextAyah } from '../../store/actions/ayahs';
import { injectIntl, InjectedIntl } from 'react-intl';
import AudioStreamer from '../../helpers/AudioStreamer';
import TranscribeAyah from './TranscribeAyah';
import RecordingButton from '../../components/RecordingButton';
import Navbar from '../../components/Navbar';
import {
  Container,
  TranslationWrapper,
  FooterWrapper,
  ToggleButtonWrapper,
} from './styles';
import humps from 'humps';
import { connect } from 'react-redux';

import ReduxState from '../../types/GlobalState';
import ToggleButton from '../../components/ToggleButton';
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
  currentAyah: IAyahShape & { surahName: string };
  previousAyahs: IAyahShape[];
  currentTranscribedIndex?: number;
  ayahFound: boolean;
  isAyahCompleted: boolean;
  isSurahCompleted: boolean;
}

interface IStateProps {
  nextAyah: IAyahShape;
  isFollowAlongMode: boolean;
}

interface IDispatchProps {
  setRecognitionResults(result: any): void;
  loadNextAyah(currentAyah: IAyahShape): void;
  clearNextAyah(): void;
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
  match: IAyahShape;
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
      isFetchingNextWord: false,
      partialQuery: '',
      query: '',
      isLoading: false,
      showErrorMessage: false,
      errorMessage: React.createElement('div'),
      fullScreen: false,
      currentAyah: null,
      isAyahCompleted: false,
      currentTranscribedIndex: 0,
      previousAyahs: [],
      ayahFound: false,
      isSurahCompleted: false,
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

    if (
      this.state.currentAyah ||
      this.state.ayahFound ||
      this.state.previousAyahs
    ) {
      await this.resetState();
    }

    this.setState({
      query: '',
      isRecording: true,
      isLoading: true,
    });

    if (this.socket.disconnected) {
      this.connectToTranscribeServer();
    }

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
    this.socket.close();
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

  handleMatchFound = async ({ match, wordCount }: IMatchFound) => {
    if (DEBUG) {
      console.log(
        `TRANSCRIBE EVENT: Match Found. surahNum: ${
          match.chapter_id
        }, ayahNum: ${match.verse_number}, wordCount: ${wordCount}`
      );
    }

    this.setState(
      { isAyahCompleted: false, currentTranscribedIndex: wordCount - 1 },
      () => {
        const { previousAyahs } = this.state;
        const matchWordsCount = match.text_simple.split(' ').length;
        if (wordCount === matchWordsCount) {
          this.setState({
            currentTranscribedIndex: -1,
            previousAyahs: [...previousAyahs, humps.camelizeKeys(match)],
            isAyahCompleted: true,
          });
        }
      }
    );
  };

  handleAyahFound = ({ ayahShape }: { ayahShape: IAyahShape }) => {
    const { loadNextAyah } = this.props;
    if (DEBUG) {
      console.log(
        `TRANSCRIBE EVENT: Ayah Found. surahNum: ${
          ayahShape.chapter_id
        } ayahNum: ${ayahShape.verse_number}`
      );
    }

    this.setState(
      {
        isAyahCompleted: false,
        isSurahCompleted: false,
        ayahFound: true,
        currentAyah: {
          ...humps.camelizeKeys(ayahShape),
          surahName: getSurahName(ayahShape.chapter_id),
        },
      },
      async () => {
        await loadNextAyah(humps.camelizeKeys(ayahShape));
      }
    );
  };

  async componentDidUpdate() {
    const { nextAyah } = this.props;
    const { isSurahCompleted, isAyahCompleted, currentAyah } = this.state;
    if (!isSurahCompleted && isAyahCompleted && nextAyah) {
      if (currentAyah) {
        if (currentAyah.chapterId !== nextAyah.chapterId) {
          await this.handleStopRecording();
          this.setState({
            isSurahCompleted: true,
          });
        }
        if (
          currentAyah.id !== nextAyah.id &&
          currentAyah.chapterId === nextAyah.chapterId
        ) {
          this.setState({
            currentAyah: {
              ...nextAyah,
              surahName: getSurahName(nextAyah.chapterId),
            },
          });
        }
      } else {
        this.setState({
          currentAyah: {
            ...nextAyah,
            surahName: getSurahName(nextAyah.chapterId),
          },
        });
      }
    }
  }

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
      currentAyah: null,
    });
    await this.props.clearNextAyah();
    await this.handleStopRecording();
  };

  connectToTranscribeServer = () => {
    const transcribeServerUrl = config('transcribeServerURL');
    this.socket = io(transcribeServerUrl);
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
  };

  componentDidMount() {
    this.connectToTranscribeServer();
  }

  async componentWillUnmount() {
    await this.handleStopRecording();
  }

  renderFinishedAyahs = () =>
    _.takeRight(this.state.previousAyahs, 4).map((currAyah: IAyahShape) => (
      <TranscribeAyah key={currAyah.id} isTranscribed={true} ayah={currAyah} />
    ));

  render() {
    const {
      currentAyah,
      ayahFound,
      isSurahCompleted,
      partialQuery,
      currentTranscribedIndex,
    } = this.state;
    const { isFollowAlongMode } = this.props;
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
            </div>
          </div>

          {ayahFound ? (
            <div className="ayah-info">
              <span className="surah-name">
                <T id={KEYS.SURAH_WORD} /> {currentAyah.surahName}{' '}
              </span>
              <span className="ayah-number">
                <T id={KEYS.AYAHS_WORD} /> {currentAyah.verseNumber}
              </span>
            </div>
          ) : this.state.partialQuery ? null : (
            <div className="ayah-info">Waiting for input...</div>
          )}

          <div>
            {/* render partial query until ayah found  */}
            {!currentAyah && <p>{partialQuery} </p>}

            {/* render finished ayahs in the follow along mode  */}
            {isFollowAlongMode && this.renderFinishedAyahs()}

            {/* render current ayah  */}
            {currentAyah && !isSurahCompleted && (
              <div>
                <TranscribeAyah
                  ayah={currentAyah}
                  isTranscribed={false}
                  currentTranscribedIndex={currentTranscribedIndex}
                />
                {!isFollowAlongMode && currentAyah.translations && (
                  <TranslationWrapper>
                    {currentAyah.translations[0].text}
                  </TranslationWrapper>
                )}
              </div>
            )}
          </div>

          <FooterWrapper>
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
            <ToggleButtonWrapper>
              <ToggleButton text={KEYS.READING_MODE} />
            </ToggleButtonWrapper>
          </FooterWrapper>
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
    isFollowAlongMode: state.status.isContinuous,
  };
};

const mapDispatchToProps = (dispatch): IDispatchProps => {
  return {
    setRecognitionResults: (result: any) => {
      return dispatch(setRecognitionResults(result));
    },
    loadNextAyah: (ayah: IAyahShape) => dispatch(loadNextAyah(ayah)),
    clearNextAyah: () => dispatch(clearNextAyah()),
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
