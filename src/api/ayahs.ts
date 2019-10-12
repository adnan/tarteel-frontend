import { backendRequestOptions } from '../helpers/cookie';
import config from '../../config';

const API_URL: string = config('apiURL');
const TARTEEL_API_KEY: string = config('tarteelAPIKey');

export const fetchRandomAyah = (req?: any) => {
  const options: object = __SERVER__
    ? backendRequestOptions(req)
    : {
        credentials: 'include',
      };
  return fetch(`${API_URL}/v1/quran/ayah/random/`, options).then(res =>
    res.json()
  );
};

export const fetchSpecificAyah = (surah: number, ayah: number) => {
  const options: object = {
    credentials: 'include',
  };
  return fetch(`${API_URL}/v1/quran/${surah}/${ayah}/`, options).then(res =>
    res.json()
  );
};

/** Upload the recording file after each recitation. */
export const sendRecording = (
  audio: any,
  surah: number,
  ayah: number,
  hash: string,
  sessionId: string,
  isContinuous: boolean
): Promise<Response> => {
  const recitationMode = isContinuous ? 'continuous' : 'discrete';
  const body = new FormData();

  body.append('file', audio, surah + '_' + ayah + '_' + hash + '.wav');
  body.append('surah_num', String(surah));
  body.append('ayah_num', String(ayah));
  body.append('hash_string', hash);
  body.append('session_id', sessionId);
  body.append('recitation_mode', recitationMode);

  return fetch(`${API_URL}/v1/recordings/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${TARTEEL_API_KEY}`,
    },
    mode: 'cors',
    body,
    credentials: 'include',
  });
};

export const fetchSurah = (num: number) => {
  return fetch(`${API_URL}/v1/quran/${num}`)
    .then(res => res.json())
    .then(response => {
      const surah = response.results;
      const { chapter_id } = surah[0];
      const ayahs = surah.reduce(
        (acc: any, curr: any) => ({
          ...acc,
          [curr.verse_number]: {
            ...curr,
            display_text: curr.text_madani,
            text: curr.text_simple,
          },
        }),
        {}
      );
      return { chapter_id, ayahs };
    });
};
