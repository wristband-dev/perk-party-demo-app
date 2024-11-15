import axios from 'axios';

const JSON_MEDIA_TYPE = 'application/json';
const XSRF_COOKIE_NAME = 'XSRF-TOKEN';
const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';

// Axios has XSRF token handling by default.  We still specify the values in the config
// here merely to be explicit about which names are being used under the hood.
const defaultOptions = {
  // Set up baseURL based on whether this is server-side or client-side
  baseURL: typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : undefined,
  headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
  xsrfCookieName: XSRF_COOKIE_NAME,
  xsrfHeaderName: XSRF_HEADER_NAME,
};

const frontendApiClient = axios.create(defaultOptions);

export default frontendApiClient;
