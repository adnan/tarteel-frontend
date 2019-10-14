import Cookies from 'js-cookie';
import humps from 'humps';

import config from '../../config';

const API_URL: string = config('apiURL');

const SESSION = `${API_URL}/v1/profile/session/`;

interface IAyah {
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
  ayahs: IAyah[];
  surahs: ISessionSurah[];
}

export interface ISessionData {
  count: number;
  results: ISession[];
}

interface ISessionBody {
  startSurah: number;
  endSurah: number;
  startAyah: number;
  endAyah: number;
  sessionTime: number;
}

export const setSessionProgress = async (body: ISessionBody) => {
  try {
    const res = await fetch(SESSION, {
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
