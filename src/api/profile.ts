import Cookies from 'js-cookie';
import humps from 'humps';

import config from '../../config';

const API_URL: string = config('apiURL');

const SESSION = `${API_URL}/v1/profile/session/`;
const RECITED_AYAHS = `${API_URL}/v1/profile/recited_ayahs/`;

interface ISessionAyah {
  surah_number: number;
  ayah_number: number;
  count: number;
  created_at: string;
  updated_at: string;
}

interface ISessionSurah {
  surah: number;
  count: number;
}

interface ISession {
  session_time: string;
  created_at: string;
  updated_at: string;
  ayahs: ISessionAyah[];
  surahs: ISessionSurah[];
}

export interface ISessionData {
  count: number;
  results: ISession[];
}

interface IRecitedAyahsBody {
	surah: number;
	ayah: number;
}

export const sumbitRecitedAyah = async (body: IRecitedAyahsBody) => {
  try {
    const res = await fetch(RECITED_AYAHS, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${Cookies.get('authToken')!}`,
        'X-CSRFToken': Cookies.get('csrftoken')!,
      },
      body: JSON.stringify(humps.decamelizeKeys(body)),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getSessionsInfo = async (): Promise<ISessionData> => {
  try {
    const res = await fetch(SESSION, {
      method: 'GET',
      credentials: 'include',
    });

    const data: ISessionData = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
