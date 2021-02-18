import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  CoreStoreProvider,
  GlobalCommonStyles,
  API,
  initGA,
} from 'teespace-core';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { setEnv, getEnv } from './env';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: ${global.screen.width / 16}%}
  }
`;

if (process.env.NODE_ENV !== 'development') {
  console.log = () => {};
  console.error = () => {};
  console.info = () => {};
  console.warn = () => {};
}

const legacyDomainURL = `${window.location.protocol}//${
  process.env.REACT_APP_DEV_SERVICE_DOMAIN || window.location.hostname
}`;
const serviceURL =
  process.env.REACT_APP_API_BASE_URL ||
  `${legacyDomainURL}/${process.env.REACT_APP_DEV_PATH}`;
const resourceURL = process.env.REACT_APP_DOMAIN_URL || legacyDomainURL;
const comURL =
  process.env.REACT_APP_COMMON_URL ||
  global.env.REACT_APP_COMMON_URL ||
  `${window.location.protocol}//${
    process.env.REACT_APP_DEV_COM_DOMAIN || window.location.hostname
  }`;
const hsmURL =
  process.env.REACT_APP_HSM_URL ||
  global.env.REACT_APP_HSM_URL ||
  `${window.location.protocol}//${
    process.env.REACT_APP_DEV_HSM_DOMAIN || window.location.hostname
  }`;
const websocketURL =
  process.env.REACT_APP_WEBSOCKET_URL ||
  `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
    process.env.REACT_APP_DEV_WEBSOCKET_DOMAIN || window.location.hostname
  }/${process.env.REACT_APP_DEV_WEBSOCKET_PATH}`;
const meetingURL =
  process.env.REACT_APP_HYPERMEETING_URL ||
  `${window.location.protocol}//${process.env.REACT_APP_MEETING_URL}`;

setEnv({
  serviceURL,
  resourceURL,
  comURL,
  hsmURL,
  websocketURL,
  meetingURL,
});

// NOTE. 로컬 환경에서 Proxy를 사용하는 경우 localhost 로 호출되어야하기 때문에
//  서비스URL(serviceURL)을 지정하면 안 됨.
if (
  process.env.REACT_APP_ENV === 'local' &&
  process.env.REACT_APP_USE_PROXY === 'yes'
) {
  API.baseURL = `${window.location.protocol}//${window.location.hostname}:${
    window.location.port
  }${new URL(process.env.REACT_APP_API_BASE_URL).pathname}`;
} else {
  API.baseURL = serviceURL;
}

initGA(global.env.PLATFORM_GA_ID);

ReactDOM.render(
  <CoreStoreProvider config={getEnv()}>
    <GlobalStyle />
    <GlobalCommonStyles />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CoreStoreProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
