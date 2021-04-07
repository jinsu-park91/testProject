import React, { useState, useCallback } from 'react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import settingIcon from '../../assets/setting.svg';
import ProfileMyModal from './ProfileMyModal';
import { isNewSpaceMessageExist } from '../../utils/GeneralUtil';

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
      <ProfileIcon className="header__profile-button" onClick={toggleMyModal}>
        {isNewSpaceMessageExist() && <NewBadge />}
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

const NewBadge = styled.div`
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #dc4547;
  top: 0.1rem;
  right: 0.1rem;
`;

const ThumbImage = styled.img`
  width: 1.88rem;
  height: 1.88rem;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  object-fit: cover;
`;

const SettingImage = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -0.1875rem;
  bottom: -0.1875rem;
  width: 1.06rem;
  height: 1.06rem;
  border-radius: 50%;
  background-color: #fff;
  img {
    width: 0.81rem;
    height: 0.81rem;
  }
`;

export default MyProfileInfo;
