import { backendRequestOptions } from '../helpers/cookie';
import config from '../../config';

const API_URL: string = config('apiURL');

interface ILoginBody {
  username?: string;
  email?: string;
  password: string;
}

interface IAuthResponse {
  key: string;
}

interface IRegisterBody {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export const getCurrentUser = async (token: string) => {
  try {
    const GET_USER_URL = `${API_URL}/v1/rest-auth/user`;
    const res = await fetch(GET_USER_URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (body: ILoginBody): Promise<IAuthResponse> => {
  try {
    const LOGIN_URL = `${API_URL}/v1/rest-auth/login/`;
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.non_field_errors) {
      const error = new Error();
      error.message = data.non_field_errors[0];
      error.name = 'credential';
      throw error;
    }

    if (data.password) {
      const error = new Error();
      error.message = data.password;
      error.name = 'password';
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const register = async (body: IRegisterBody): Promise<IAuthResponse> => {
  try {
    const REGISTER_URL = `${API_URL}/v1/rest-auth/registration/`;
    const response = await fetch(REGISTER_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!data.key) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<any> => {
  try {
    const LOGOUT_URL = `${API_URL}/v1/rest-auth/logout/`;
    const response = await fetch(LOGOUT_URL, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendEmail = async (body: any) => {
  const EMAIL_URL = `${API_URL}/v1/send_email/`;
  return fetch(
    EMAIL_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO(piraka9011)
        // Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    }
  )
};
