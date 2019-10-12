import { History, Location } from 'history';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { withCookies } from 'react-cookie';

import axios from 'axios';

import AppHelmet from './components/AppHelmet';
import config from '../config';
import CookiesBanner from './components/CookiesBanner';
import LanguagePicker from './components/LanguagePicker';
import Routes from './components/Routes';
import { setLocation } from './store/actions/router';

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
}

type IProps = IOwnProps & IDispatchProps;

class App extends React.Component<IProps, never> {
  public async componentDidMount() {
    const authtoken = this.props.cookies.get('authtoken');
    const csrftoken = this.props.cookies.get('csrftoken');
    console.log("Cookies:");
    console.log(`authtoken: ${authtoken}`);
    console.log(`csrftoken: ${csrftoken}`);
    console.log(`typeof authtoken: ${typeof authtoken}`);
    console.log(`bool check: ${authtoken === undefined}`);
    // fake login
    const API_URL: string = config('apiURL');
    const LOGIN_URL = `${API_URL}/v1/rest-auth/login/`;
    const GET_USER_URL = `${API_URL}/v1/rest-auth/user/`;
    const GET_SESSION = `${API_URL}/v1/profile/session/`;
    const RECITED_AYAHS = `${API_URL}/v1/profile/recited_ayahs/`;
    const CSRF_TOKEN = `${API_URL}/v1/csrf_token/`;

    if (authtoken !== undefined) {
      console.log("Getting user info");
      await fetch(GET_USER_URL, {
        method: 'GET',
        headers: {
          Authorization: `Token ${authtoken}`,
        },
      });
      const csrfTokenRes = await fetch(CSRF_TOKEN, {
        credentials: 'include',
      });

      const { csrfToken } = await csrfTokenRes.clone().json();
      console.log(csrfToken, 'TO');
      fetch(GET_SESSION, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'x-csrftoken': csrfToken,
					Cookie: `sessionid=e80lb8tx0ua03p1y1mvs1fid77x4c0oy; csrftoken=${csrfToken}`,
          Authorization: `Token ${authtoken}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log("Session data:");
          console.log(data);
        });
    } else {
      console.log("Logging in");
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test1',
          password: '123hardpassword',
        }),
      });

      const data = await response.json();
      // localStorage.setItem('authtoken', data.key);
      // console.log("authtoken stored in localStorage.");
      this.props.cookies.set('authtoken', data.key);
      console.log('authtoken stored in cookies.')
    }

    // Registering the first page because it's won't be handled by the listener
    logScreen();
    // To dispatch a location change redux action every time the route changes.
    this.props.history.listen((location, action) => {
      this.props.setLocation(location);
      logScreen();
    });
  }
  public render() {
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
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(injectIntl(withCookies(App)))
);
