import React from 'react';
import ProgressBar from 'progressbar.js';

import { Wrapper, CounterWrapper, CounterText } from './styles';
import config from '../../../../config';
import KEYS from '../../../locale/keys';
import T from '../../../components/T';
import { commaFormatter } from '../../../helpers/utils';

interface IProps {
  recitedAyahs: number;
  recordingCount: number;
}

class AyahsContributedCounter extends React.Component<IProps, {}> {
  private progressCounter = React.createRef<HTMLDivElement>();
  configureProgressBar = () => {
    const { recitedAyahs } = this.props;
    const counter = this.progressCounter.current!;

    // Progress bar circle for collected ayah goal with total ayahs so far
    const bar = new ProgressBar.Circle(counter, {
      color: '#aaa',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 4,
      trailWidth: 1,
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false,
      },
      from: { color: '#5ec49e', width: 1 },
      to: { color: '#5ec49e', width: 4 },
      // Set default step function for all animate calls
      step: (state, circle) => {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
        // Change config('objective') to determine total number of ayahs to achieve
        const value = Math.round(
          (circle.value() * recitedAyahs * config('objective')) / recitedAyahs
        );
        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(commaFormatter(value));
        }
      },
    });
    bar.text.style.fontFamily = 'Proxima Nova';
    bar.text.style.fontSize = '2rem';
    const animateValue = recitedAyahs / config('objective');
    bar.animate(animateValue); // Number from 0.0 to 1.0
  };

  componentDidMount() {
    if (this.props.recitedAyahs) {
      this.configureProgressBar();
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.recitedAyahs !== prevProps.recitedAyahs) {
      this.configureProgressBar();
    }
  }

  render() {
    return (
      <Wrapper>
        <CounterWrapper ref={this.progressCounter}>
          <CounterText>
            <T id={KEYS.AYAHS_RECITED} />
          </CounterText>
        </CounterWrapper>
        <T
          id={KEYS.ABOUT_PAGE_RECITED_AYAHS_MESSAGE}
          values={{
            recitedAyahs: commaFormatter(this.props.recordingCount),
          }}
        />
      </Wrapper>
    );
  }
}

export default AyahsContributedCounter;
