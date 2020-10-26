import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.less';
import { create } from 'mobx-persist';
import { useCoreStores } from 'teespace-core';
import ServicePage from './page/ServicePage';
import LoginPage from './page/LoginPage';
import NotFoundPage from './page/NotFoundPage';
import SignUpPage from './page/SignUpPage';
import SignUpFormPage from './page/SignUpFormPage';
import SignUpCompletePage from './page/SignUpCompletePage';
import TestPage from './local-test/TestPage';
import MainPage from './page/MainPage';
import RedirectablePublicRoute from './libs/RedirectablePublicRoute';
import PrivateRoute from './libs/PrivateRoute';

const hydrate = create();

function App() {
  const [isHydrating, setIsHydrating] = useState(false);
  const { authStore, userStore } = useCoreStores();

  useEffect(() => {
    Promise.all([hydrate('auth', authStore), hydrate('user', userStore)])
      .then(() => {
        userStore.initHydratedMyProfile({});
        setIsHydrating(true);
      })
      .catch(e => console.error(e));

    document.body.style.fontSize = `${global.screen.width / 13.66}%`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isHydrating) return <></>;
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ServicePage} />
        <Route exact path="/test" component={() => <TestPage />} />
        <RedirectablePublicRoute
          exact
          path="/login"
          component={<LoginPage />}
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
        <PrivateRoute path="/:tab(s|f|m)/:id/:mainApp?" component={MainPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
