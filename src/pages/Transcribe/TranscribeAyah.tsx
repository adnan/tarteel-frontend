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
`;

const Word = Styled.span`
	display: inline-block;
	color: ${(props: IWordProps) => (props.color ? props.color : colors.black)}
`;

interface IProps {
  ayah: IAyahShape;
  isTranscribed: boolean;
  currentTranscribedIndex?: number;
}

interface IState {
  words: WordShape[];
}

class TranscribeAyah extends React.Component<IProps, IState> {
  state = {
    words: this.props.ayah.words,
  };

  /*
   * foramteWords is a helper function to merge symbol words e.g: 'pause words' into the next or prev word
   * e.g:
   * the words before format
   * words: [..., { ..., code: "&#xfb58;", textSimple: "الارض"  }, { ..., code: "&#xfb59;", textMadani: null  }, ...]
   * after format the words array
   * formatedWords: [ ..., { ..., code: "&#xfb58; &#xfb59;", textSimple: "الارض"  }, ...  ]
   */
  formatWords = () => {
    const { words } = this.props.ayah;

    // filter the words of type 'word' or type 'end'
    const wordsOfTypeWordAndEnd = words.filter(
      word =>
        word.charType === WORD_TYPES.CHAR_TYPE_WORD ||
        word.charType === WORD_TYPES.CHAR_TYPE_END
    );

    // filter the symbol words like 'pause, sajda'
    const symbolWords = words.filter(
      word =>
        word.charType !== WORD_TYPES.CHAR_TYPE_WORD &&
        word.charType !== WORD_TYPES.CHAR_TYPE_END
    );

    // reduce the words array into a modified one
    const modifidedWords = symbolWords.reduce((prev, word, index) => {
      // get the index of the word that we will merge the symbol on it
      const validWordIndex = prev.findIndex(
        w => w.id === word.id - 1 || w.id === word.id + 1
      );

      const validWord = prev[validWordIndex];
      // check if the valid word index greater than symbol index so we should add symbol code before it's code, vice versa
      const code =
        validWordIndex > index
          ? `${validWord.code} ${word.code}`
          : `${word.code} ${validWord.code}`;
      // return the new array by modify the word by join the symbol code with the word code
      return [
        ...prev.slice(0, validWordIndex),
        {
          ...validWord,
          code,
        },
        ...prev.slice(validWordIndex + 1),
      ];
    }, wordsOfTypeWordAndEnd);

    this.setState({
      words: modifidedWords ? modifidedWords : wordsOfTypeWordAndEnd,
    });
  };

  componentDidMount() {
    this.formatWords();
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props.ayah.id !== prevProps.ayah.id) {
      this.formatWords();
    }
  }

  renderWords = () => {
    return this.state.words.map(
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
  };

  render() {
    return <VerseWrapper>{this.renderWords()}</VerseWrapper>;
  }
}

export default TranscribeAyah;
