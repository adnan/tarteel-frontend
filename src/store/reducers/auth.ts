import { ActionType, getType } from 'typesafe-actions';

import ReduxState from '../../types/GlobalState';
import * as auth from '../actions/auth';
import initState from '../initState';

export type authActions = ActionType<typeof auth>;

export const INITIAL_STATE = initState().auth;

export default (
  state: ReduxState['auth'] = INITIAL_STATE,
  action: authActions
) => {
  switch (action.type) {
    case getType(auth.authAsync.request):
      return {
        ...state,
        isLoading: true,
      };
    case getType(auth.authAsync.success):
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
      };
    case getType(auth.authAsync.failure):
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
