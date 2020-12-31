import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.less';
import { create } from 'mobx-persist';
import { PortalProvider, useCoreStores } from 'teespace-core';
import { initApp as initTalkApp } from 'teespace-talk-app';
import { initApp as initDriveApp } from 'teespace-drive-app';
import {
  initApp as initCalendarApp,
  initializeApp as initializeCalendarApp,
} from 'teespace-calendar-app';
import { initApp as initMailApp } from 'teespace-mail-app';
// import { I18nextProvider } from 'react-i18next';
import AdminPage from './page/AdminPage';
import LoginPage from './page/LoginPage';
import NotFoundPage from './page/NotFoundPage';
import SignUpPage from './page/SignUpPage';
import SignUpFormPage from './page/SignUpFormPage';
import SignUpCompletePage from './page/SignUpCompletePage';
import DriveSharedFilePage from './page/DriveSharedFilePage';
import OfficeFilePage from './page/OffiveFilePage';
import LogoutPage from './page/LogoutPage';
// import MainPage from './local-test/MainPage';
import MainPage from './page/MainPage';
import RedirectablePublicRoute from './libs/RedirectablePublicRoute';
import PrivateRoute from './libs/PrivateRoute';
import KeycloakRedirectRoute from './libs/KeycloakRedirectRoute';
import keycloak from './libs/keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';
// import i18next from './i18n';

const hydrate = create();

function App() {
  const [isHydrating, setIsHydrating] = useState(false);
  const { authStore, userStore } = useCoreStores();

  const url = window.location.origin; //  http://xxx.dev.teespace.net
  const con_url = url.split(`//`)[1]; // xxx.dev.teespace.net
  const sub_url = url.split(`//`)[1].split(`.`)[0]; //  xxx
  const main_url = con_url.slice(con_url.indexOf('.') + 1, con_url.length); // dev.teespace.net

  const getCookieValue = key => {
    const cookieKey = `${key}=`;
    let result = '';
    const cookieArr = document.cookie.split(';');

    for (let i = 0; i < cookieArr.length; i++) {
      if (cookieArr[i][0] === ' ') {
        cookieArr[i] = cookieArr[i].substring(1);
      }

      if (cookieArr[i].indexOf(cookieKey) === 0) {
        result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
        return result;
      }
    }
    return result;
  };

  // initialize apps
  useEffect(() => {
    initTalkApp();
    initMailApp();
    initDriveApp();
    initCalendarApp();
    initializeCalendarApp();
  }, []);

  // hydrate mobx stores
  useEffect(() => {
    Promise.all([hydrate('auth', authStore), hydrate('user', userStore)])
      .then(() => {
        userStore.initHydratedMyProfile({});
        setIsHydrating(true);
      })
      .catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isHydrating) return <></>;
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/drive/files/:fileId">
            <DriveSharedFilePage />
          </Route>
          <Route>
            <ReactKeycloakProvider
              authClient={keycloak}
              LoadingComponent={<></>}
              initOptions={
                // tokenParam
                getCookieValue(`ACCESS_TOKEN`)
                  ? {
                      token: getCookieValue(`ACCESS_TOKEN`),
                      refreshToken: getCookieValue(`REFRESH_TOKEN`),
                    }
                  : {
                      onLoad: 'check-sso',
                      checkLoginIframe: false,
                      redirectUri:
                        process.env.REACT_APP_ENV === 'local'
                          ? `${window.location.href}`
                          : `${window.location.protocol}//${main_url}/domain/${sub_url}`,
                    }
              }
            >
              <PortalProvider>
                {/* <I18nextProvider i18n={i18next}> */}
                <BrowserRouter>
                  <Switch>
                    <Route exact path="/">
                      <Redirect to="/login" />
                    </Route>
                    <Route exact path="/logout" component={LogoutPage} />

                    <KeycloakRedirectRoute
                      exact
                      path="/login"
                      component={
                        process.env.REACT_APP_ENV === `local`
                          ? LoginPage
                          : MainPage
                      }
                    />
                    <PrivateRoute
                      path="/office/:fileId"
                      component={OfficeFilePage}
                    />
                    <RedirectablePublicRoute
                      exact
                      path="/register"
                      component={<SignUpPage />}
                    />
                    <RedirectablePublicRoute
                      exact
                      path="/registerForm"
                      component={<SignUpFormPage />}
                    />
                    <RedirectablePublicRoute
                      exact
                      path="/registerComplete"
                      component={<SignUpCompletePage />}
                    />
                    <PrivateRoute
                      path="/:resourceType(s|f|m)/:resourceId/:mainApp?"
                      component={MainPage}
                    />
                    <Route path="/admin">
                      <AdminPage />
                    </Route>
                    <Route component={NotFoundPage} />
                  </Switch>
                  {/* <PrivateRoute
            path="/users"
            component={MainPage}
          /> */}
                </BrowserRouter>
                {/* </I18nextProvider> */}
              </PortalProvider>
            </ReactKeycloakProvider>
          </Route>
        </Switch>
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;
