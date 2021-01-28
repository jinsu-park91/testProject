import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import settingIcon from '../../assets/setting.svg';
import ProfileMyModal from './ProfileMyModal';

const MyProfileInfo = observer(() => {
  const { userStore, authStore } = useCoreStores();
  const userId = authStore.user.id;
  const { isFirstLogin } = authStore.sessionInfo;
  const [myModalVisible, setMyModalVisible] = useState(isFirstLogin);
  const [tutorialVisible, setTutorialVisible] = useState(isFirstLogin);

  const toggleMyModal = useCallback(() => {
    setMyModalVisible(v => !v);
    if (tutorialVisible) {
      setTutorialVisible(false);
    }
  }, [tutorialVisible]);

  const thumbPhoto = userStore.getProfilePhotoURL(
    userStore.myProfile.id,
    'small',
  );

  const thumbPhotoMedium = userStore.getProfilePhotoURL(
    userStore.myProfile.id,
    'medium',
  );

  return (
    <>
      <ProfileIcon onClick={toggleMyModal}>
        <ThumbImage src={thumbPhoto} />
        <SettingImage>
          <img alt="settingIcon" src={settingIcon} />
        </SettingImage>
      </ProfileIcon>
      <ProfileMyModal
        userId={userId}
        onCancel={toggleMyModal}
        visible={myModalVisible}
        thumbPhoto={thumbPhotoMedium}
        created={tutorialVisible}
      />
    </>
  );
});

const ProfileIcon = styled.div`
  position: relative;
  cursor: pointer;
`;

const ThumbImage = styled.img`
  width: 1.88rem;
  height: 1.88rem;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  object-fit: cover;
`;

const SettingImage = styled.div`
  position: absolute;
  right: -0.125rem;
  bottom: -0.125rem;
  line-height: 0;
  width: 0.9375rem;
  height: 0.9375rem;
`;

export default MyProfileInfo;
