import { History, Location } from 'history';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import styled, { createGlobalStyle } from 'styled-components';
import { withCookies } from 'react-cookie';

import AppHelmet from './components/AppHelmet';
import config from '../config';
import CookiesBanner from './components/CookiesBanner';
import LanguagePicker from './components/LanguagePicker';
import Routes from './components/Routes';
import { setLocation } from './store/actions/router';
import { getLocalStorage } from './helpers/get';
import { getCurrentUser } from './store/actions/auth';

import './styles/index.scss';

// import Amplify from 'aws-amplify';
// import AWSConfig from './aws-exports';
import logScreen from './helpers/logScreen';

// Amplify.configure(AWSConfig);

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props: any) =>
      props.path === '/evaluator' ? '#F4F3F2' : '#fff'};
  }
`;

interface IOwnProps {
  location: Location;
  history: History;
}

interface IDispatchProps {
  setLocation(location: Location): void;
  getCurrentUser(token: string): void;
}

interface IState {
  isLoading: boolean;
}

type IProps = IOwnProps & IDispatchProps;

class App extends React.Component<IProps, IState> {
  state = {
    isLoading: true,
  };

  public async componentDidMount() {
    const token = this.props.cookies.get('authToken');
    if (token) {
      await this.props.getCurrentUser(token);
    }

    this.setState({ isLoading: false }, () => {
      // Registering the first page because it's won't be handled by the listener
      logScreen();
      // To dispatch a location change redux action every time the route changes.
      this.props.history.listen((location, action) => {
        this.props.setLocation(location);
        logScreen();
      });
    });
  }

  public render() {
    if (this.state.isLoading) {
      <AppHelmet path={this.props.location.pathname} />;
    }

    return (
      <Container>
        <GlobalStyle path={this.props.location.pathname} />
        <AppHelmet path={this.props.location.pathname} />
        <Routes />
        {/*<CookiesBanner />*/}
      </Container>
    );
  }
}

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  max-width: 900px;
  margin: auto;

  .rtl {
    direction: rtl;
  }

  .text-center {
    text-align: center;
  }
`;

const mapDispatchToProps = dispatch => {
  return {
    setLocation: (location: Location) => {
      dispatch(setLocation(location));
    },
    getCurrentUser: (token: string) => dispatch(getCurrentUser(token)),
  };
};

const enhanced = compose(
  withRouter,
  injectIntl,
  withCookies,
  connect(
    null,
    mapDispatchToProps
  )
);

export default enhanced(App);
