import { createAsyncAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import * as AuthAPI from '../../api/auth';
import ILogin from '../../shapes/ILogin';
import IRegister from '../../shapes/IRegister';

export const authAsync = createAsyncAction(
  'auth/LOGIN_REQUEST',
  'auth/LOGIN_SUCCESS',
  'auth/LOGIN_FAILURE'
)<void, void, Error>();

export const login = (data: ILogin) => async (dispatch: Dispatch) => {
  try {
    dispatch(authAsync.request());
    await AuthAPI.login(data);
    dispatch(authAsync.success());
  } catch (error) {
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
    dispatch(authAsync.failure(error));
  }
};
