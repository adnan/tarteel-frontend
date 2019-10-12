import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import * as AuthAPI from '../../api/auth';
import ILogin from '../../shapes/ILogin';
import IRegister from '../../shapes/IRegister';

export const authAsync = createAsyncAction(
  'auth/LOGIN_REQUEST',
  'auth/LOGIN_SUCCESS',
  'auth/LOGIN_FAILURE'
)<void, void, Error | { [key: string]: string }>();

export const logoutAction = createStandardAction('auth/LOGOUT')<undefined>();

export const getCurrentUser = (token: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(authAsync.request());
    const data = await AuthAPI.getCurrentUser(token);
    if (data.username) {
      dispatch(authAsync.success());
    } else {
      localStorage.removeItem('token');
      dispatch(authAsync.failure(new Error('bad token')));
    }
  } catch (error) {
    localStorage.removeItem('token');
    dispatch(authAsync.failure(error));
  }
};
export const login = (data: ILogin) => async (dispatch: Dispatch) => {
  try {
    dispatch(authAsync.request());
    const res = await AuthAPI.login(data);
    localStorage.setItem('token', res.key);
    dispatch(authAsync.success());
  } catch (error) {
    localStorage.removeItem('token');
    dispatch(authAsync.failure(error));
  }
};

export const register = (data: IRegister) => async (dispatch: Dispatch) => {
  try {
    dispatch(authAsync.request());
    await AuthAPI.register({
      ...data,
      password1: data.password,
      password2: data.confirmPassword,
    });
    dispatch(authAsync.success());
  } catch (error) {
    localStorage.removeItem('token');
    dispatch(authAsync.failure(JSON.parse(error.message) || error));
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  try {
    dispatch(authAsync.request());
    await AuthAPI.logout();
    localStorage.removeItem('token');
    dispatch(logoutAction());
  } catch (error) {
    dispatch(authAsync.failure(JSON.parse(error.message) || error));
  }
};
