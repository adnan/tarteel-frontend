import { backendRequestOptions } from '../helpers/cookie';
import config from '../../config';

const API_URL: string = config('apiURL');
const TARTEEL_API_KEY: string = config('tarteelAPIKey');

export const fetchEvaluatorAyah = (req?: any) => {
  const options = __SERVER__
    ? backendRequestOptions(req)
    : {
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Authorization': `Token ${TARTEEL_API_KEY}`,
        }
      };
  return fetch(`${API_URL}/v1/evaluation/low_count/`, options).then(
    (res: Response) => res.json()
  );
};

export const submitEvaluation = (evaluationRequest: object) => {
  fetch(`${API_URL}/v1/evaluation/`, {
    method: 'POST',
    body: JSON.stringify(evaluationRequest),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${TARTEEL_API_KEY}`,
    },
    credentials: 'include',
  })
    .then(res => {
      if (res.status === 201) {
        console.log('Successfully Submitted!');
      }
    })
    .catch(e => {
      console.log(e.message);
    });
};

export const fetchSpecificEvaluatorAyah = (
  surahNum: number,
  ayahNum: number
) => {
  /**
   * Get a recording of a specific surah & ayah that is not evaluated yet.
   * Check to make sure response is valid as well.
   * @param surahNum - Requested surah number.
   * @param ayahNum - Requested ayah number.
   * @returns Response with a promise to the 'v1/evaluation/low_count/ URL
   */
  const options = {
    method: 'POST',
    body: JSON.stringify({
      surah: surahNum,
      ayah: ayahNum,
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Authorization': `Token ${TARTEEL_API_KEY}`,
    },
    credentials: 'include',
  };
  return fetch(`${API_URL}/v1/evaluation/low_count/`, options).then(
    (res: Response) => {
      if (res.status !== 200) {
        return Promise.reject(res);
      } else {
        return res.json();
      }
    }
  );
};
