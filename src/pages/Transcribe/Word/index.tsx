import React from 'react';

import { WORD_TYPES } from '../../../types';
import { NormalWordWrapper, MemoWordWrapper } from './styles';

interface IProps {
  isActiveWord: boolean;
  charType: string;
  variant: 'normal' | 'memorization';
  activeWordColor: string;
  inactiveWordColor: string;
}

interface IState {
  isActive: boolean;
}

export default class Word extends React.Component<
  IProps & React.HTMLProps<HTMLSpanElement>,
  IState
> {
  state = {
    isActive: this.props.isActiveWord,
  };

  highlightTheWord = () => {
    if (
      this.props.variant === 'memorization' &&
      this.props.charType !== WORD_TYPES.CHAR_TYPE_END
    ) {
      this.setState({ isActive: this.props.isActiveWord });
    }
  };

  componentDidMount() {
    this.highlightTheWord();
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      (!prevProps.isActiveWord && this.props.isActiveWord) ||
      prevProps.variant !== this.props.variant
    ) {
      this.highlightTheWord();
    }
  }

  render() {
    const {
      isActiveWord,
      charType,
      variant,
      activeWordColor,
      inactiveWordColor,
      ...otherProps
    } = this.props;

    if (variant === 'memorization') {
      const isAyahNumber = charType === WORD_TYPES.CHAR_TYPE_END;
      const getColor = () => {
        if (isAyahNumber) {
          if (this.state.isActive) {
            return activeWordColor;
          }

          return inactiveWordColor;
        } else {
          if (this.state.isActive) {
            return activeWordColor;
          }
          return 'transparent';
        }
      };

      return (
        <MemoWordWrapper
          isAyahNumber={isAyahNumber}
          isActive={this.state.isActive}
          color={getColor()}
          {...otherProps}
        />
      );
    }

    return (
      <NormalWordWrapper
        color={isActiveWord ? activeWordColor : inactiveWordColor}
        {...otherProps}
      />
    );
  }
}
