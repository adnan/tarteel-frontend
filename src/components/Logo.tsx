import React from 'react';
import { Link } from 'react-router-dom';
import Tippy from '@tippy.js/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import LogoImage from '../../public/logo-1x.png';
import { commaFormatter } from '../helpers/utils';
import ReduxState, { IProfile } from '../types/GlobalState';

const RECITATION_TARGET = '100K';

interface IOwnProps {
  counterText: string;
}

interface IStateProps {
  profile: IProfile;
}

type IProps = IStateProps & IOwnProps;

class Logo extends React.Component<IProps, never> {
  /** Renders the logo in the top left corner with total contributed/contribution-goal ayahs. */
  public render() {
    return (
      <Container>
        <Link to="/">
          <img src={LogoImage} alt="Tarteel-logo" />
        </Link>
        <Link
          to={'/about'}
          data-balloon="Total Ayas Recited"
          data-balloon-pos="down"
          className="counter"
        >
          <Tippy content="Total Contributed Ayahs" trigger="mouseenter">
            <div className="contributed">
              {commaFormatter(this.props.profile.recordingCount)}
            </div>
          </Tippy>
          <Tippy content="Contribution Goal" trigger="mouseenter">
            <div className="contribution-goal">/{RECITATION_TARGET}</div>
          </Tippy>
        </Link>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 50px;
  height: 50px;
  cursor: pointer;

  img {
    height: 100%;
    width: 100%;
    margin-top: 5px;
  }
  .counter {
    position: absolute;
    left: 56px;
    top: 7px;
    border-radius: 23px;
    height: 25px;
    line-height: 25px;
    text-align: left;
    background: transparent;
    border: 0;
    padding: 0;
    color: #000;

    .contributed {
      color: ${props => props.theme.colors.linkColor};
      font-size: 22px;
    }
    .contribution-goal {
      font-size: 14px;
      font-family: proxima_nova_semibold;
      position: relative;
      top: -5px;
      text-align: right;
    }
  }
`;

const mapStateToProps = (state: ReduxState): IStateProps => {
  return {
    profile: state.profile,
  };
};

export default connect(mapStateToProps)(Logo);
