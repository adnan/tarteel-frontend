import { isIOS, isSafari } from 'react-device-detect';

export const isIOSEmbeddedBrowser = () => {
  return isIOS && !isSafari;
};
