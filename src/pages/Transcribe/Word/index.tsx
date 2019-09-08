import React from 'react';

import { WORD_TYPES } from '../../../types';
import { NormalWordWrapper, MemoWordWrapper } from './styles';

interface IProps {
  isActiveWord: boolean;
  charType: string;
  variant: 'normal' | 'memorzation';
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

  muteTheWord = () => {
    if (
      this.props.variant === 'memo' &&
      this.props.charType !== WORD_TYPES.CHAR_TYPE_END
    ) {
      this.setState({ isActive: this.props.isActiveWord }, () => {
        setTimeout(() => {
          this.setState({ isActive: false });
        }, 500);
      });
    }
  };

  componentDidMount() {
    this.muteTheWord();
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      (!prevProps.isActiveWord && this.props.isActiveWord) ||
      prevProps.variant !== this.props.variant
    ) {
      this.muteTheWord();
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

    if (variant === 'memorzation') {
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
