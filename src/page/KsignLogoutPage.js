import React, { useEffect } from 'react';
import { useCoreStores } from 'teespace-core';
import Cookies from 'js-cookie';
import wwms from '../libs/wwms';

const KsignLogoutPage = () => {
  const { authStore } = useCoreStores();

  //   const url = window.location.origin; //  http://xxx.dev.teespace.net
  //   const conURL = url.split(`//`)[1]; // xxx.dev.teespace.net
  //   const mainURL = conURL.slice(conURL.indexOf('.') + 1, conURL.length); // dev.teespace.net
  //   const redirectURL =
  //     process.env.REACT_APP_ENV === `local`
  //       ? `${url}/login`
  //       : `${window.location.protocol}//${mainURL}/spaces`;

  useEffect(() => {
    const logoutLogic = async () => {
      await authStore.logout();

      wwms.disconnect();
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('DEVICE_TYPE');

      window.location.href = `/cnu/sso/logout.jsp`;
    };

    logoutLogic();
  }, [authStore]);

  return <div />;
};
export default KsignLogoutPage;