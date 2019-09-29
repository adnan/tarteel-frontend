import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import ReduxState from '../types/GlobalState';

/*
 * private => pervent unauthenticated users to reach the page
 * public => only  unauthenticated  users can reach the page (e.g: Login/Reigster)
*/
export enum AuthType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

interface IProps {
  isAuthenticated: boolean;
  history: History;
}

const mapStateToProps = (state: ReduxState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const enhanced = compose(
  withRouter,
  connect(
    mapStateToProps,
    null
  )
);

export default function(WrappedComponent: React.ComponentType, type: AuthType) {
  class Authenticate extends React.Component<IProps, {}> {
    render() {
      const isPrivate = type === AuthType.PRIVATE;
      const { isAuthenticated } = this.props;

      if (isAuthenticated && !isPrivate) {
        this.props.history.push('/');
      }

      if (!isAuthenticated && isPrivate) {
        this.props.history.push('/login');
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  return enhanced(Authenticate);
}
