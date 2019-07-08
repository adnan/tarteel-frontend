import React from 'react';
import Styled, { StyledFunction } from 'styled-components';
import classNames from 'classnames';

import IAyahShape from '../../shapes/IAyahShape';
import WordShape from '../../shapes/WordShape';
import T from '../../components/T';
import { WORD_TYPES } from '../../types';
import KEYS from '../../locale/keys';
import { colors } from '../../theme';

interface IWordProps {
  color: string;
}

const VerseWrapper = Styled.div`
direction: rtl;
  font-size: 5.5vmin;
	width: 100%;
	max-width: 750px;
	color: black;
	.word {
  	display: inline-block;
    span {
      -webkit-font-smoothing: antialiased;
    }
  }
`;

const Word = Styled.span`
color: ${(props: IWordProps) => (props.color ? props.color : colors.black)}`;

interface IState {
  ayah: IAyahShape;
  isTranscribed: boolean;
  currentTranscribedIndex?: number;
}

class TranscribeAyah extends React.Component<IState> {
  renderWords = () =>
    this.props.ayah.words.map(
      ({ charType, className, code, id }: WordShape, index: number) => {
        const classname = classNames({
          [className]: true,
          [charType]: true,
        });

        const { isTranscribed, currentTranscribedIndex = 0 } = this.props;
        const getColor = () => {
          if (isTranscribed) {
            return charType === WORD_TYPES.CHAR_TYPE_END
              ? colors.linkColor
              : colors.textMuted;
          }

          if (index <= currentTranscribedIndex) {
            return colors.black;
          }
          return colors.textMuted;
        };

        return (
          <Word
            key={id}
            className={className}
            // use "dangerouslySetInnerHTML" to render ayah's word unicode.
            dangerouslySetInnerHTML={{ __html: code }}
            color={getColor()}
          />
        );
      }
    );

  render() {
    return <VerseWrapper>{this.renderWords()}</VerseWrapper>;
  }
}

export default TranscribeAyah;
