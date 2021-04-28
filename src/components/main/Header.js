import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import {
  useCoreStores,
  ProfileInfoModal,
  logEvent,
  EventBus,
  Tooltip,
} from 'teespace-core';
import MeetingApp from 'teespace-meeting-app';
import { useTranslation } from 'react-i18next';
import {
  Wrapper,
  TitleWrapper,
  Title,
  AppIconContainer,
  AppIconbutton,
  UserMenu,
  TitleText,
  UserCountText,
  IconWrapper,
  SystemIconContainer,
  AppIconInner,
  StyledPhotos,
  VerticalBar,
} from './HeaderStyle';
import { useStores } from '../../stores';
import HeaderProfile from '../profile/HeaderProfile';
import RoomInquiryModal from '../Rooms/RoomInquiryModal';
import RoomAddMemberModal from '../Rooms/RoomAddMemberModal';
import {
  ExportIcon,
  SearchIcon,
  AddAcountIcon,
  NoteIcon,
  NoteActiveIcon,
  DriveIcon,
  DriveActiveIcon,
  CalendarIcon,
  CalendarActiveIcon,
  ViewFileIcon,
  ViewFileActiveIcon,
  MeetingIcon,
  MeetingActiveIcon,
  OpenChatBgIcon,
} from '../Icons';
import { getQueryParams, getQueryString } from '../../utils/UrlUtil';
import useLocalObservable from '../../libs/useLocalObservable';

const getIconStyle = (isDisabled = false) => {
  return {
    width: 1.38,
    height: 1.38,
    color: isDisabled ? 'rgba(68, 77, 89, 0.3)' : '#232D3B',
  };
};

const AppIcon = React.memo(
  ({
    isActive,
    appName,
    i18n,
    onClick,
    defaultIcon,
    activeIcon,
    disabledIcon,
    disabled,
  }) => {
    const { t } = useTranslation();

    const handleAppClick = () => {
      onClick(appName);
    };

    let icon = defaultIcon;
    if (disabled) {
      icon = disabledIcon;
    } else {
      icon = isActive ? activeIcon : defaultIcon;
    }

    return (
      <Tooltip placement="bottom" title={t(i18n)} color="#4C535D">
        <AppIconInner
          className={`header__${appName}-button`}
          key={appName}
          onClick={handleAppClick}
          disabled={disabled}
        >
          {icon}
        </AppIconInner>
      </Tooltip>
    );
  },
);

const useActiveApp = () => {
  const { configStore } = useCoreStores();

  const driveApp = useMemo(
    () => ({
      name: 'drive',
      i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_18',
      icons: {
        active: <DriveActiveIcon {...getIconStyle()} />,
        disabled: <DriveIcon {...getIconStyle(true)} />,
        default: <DriveIcon {...getIconStyle()} />,
      },
      isUsedInMyRoom: true,
      isSeperated: false,
      isUsedInProfile: true,
    }),
    [],
  );
  const calendarApp = useMemo(
    () => ({
      name: 'calendar',
      i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_17',
      icons: {
        active: <CalendarActiveIcon {...getIconStyle()} />,
        disabled: <CalendarIcon {...getIconStyle(true)} />,
        default: <CalendarIcon {...getIconStyle()} />,
      },
      isUsedInMyRoom: true,
      isSeperated: false,
      isUsedInProfile: true,
    }),
    [],
  );
  const noteApp = useMemo(
    () => ({
      name: 'note',
      i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_19',
      icons: {
        active: <NoteActiveIcon {...getIconStyle()} />,
        disabled: <NoteIcon {...getIconStyle(true)} />,
        default: <NoteIcon {...getIconStyle()} />,
      },
      isUsedInMyRoom: true,
      isSeperated: false,
      isUsedInProfile: true,
    }),
    [],
  );
  const meetingApp = useMemo(
    () => ({
      name: 'meeting',
      i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_20',
      icons: {
        active: <MeetingActiveIcon {...getIconStyle()} />,
        disabled: <MeetingIcon {...getIconStyle(true)} />,
        default: <MeetingIcon {...getIconStyle()} />,
      },
      isUsedInMyRoom: false,
      isSeperated: false,
      isUsedInProfile: false,
    }),
    [],
  );
  const files = useMemo(
    () => ({
      name: 'files',
      i18n: 'CM_B2C_CONTENTS_AREA_EMPTY_PAGE_16',
      icons: {
        active: <ViewFileActiveIcon {...getIconStyle()} />,
        disabled: <ViewFileIcon {...getIconStyle(true)} />,
        default: <ViewFileIcon {...getIconStyle()} />,
      },
      isUsedInMyRoom: true,
      isSeperated: true,
      isUsedInProfile: true,
    }),
    [],
  );

  const state = useLocalObservable(() => ({
    activeApps: [],
    updateActiveApps() {
      this.activeApps = [];

      if (configStore.isActivateForCNU('Drive')) {
        this.activeApps.push(driveApp);
      }
      this.activeApps.push(calendarApp);
      this.activeApps.push(noteApp);
      if (configStore.isActivateForCNU('Meeting')) {
        this.activeApps.push(meetingApp);
      }
      if (configStore.isActivateForCNU('Files')) {
        this.activeApps.push(files);
      }
    },
  }));

  useEffect(() => {
    state.updateActiveApps();
  }, []);

  return state.activeApps;
};

const Header = observer(() => {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const { uiStore } = useStores();
  const { roomStore, userStore } = useCoreStores();
  const [isRoomProfileVisible, setRoomProfileVisible] = useState(false);
  const [isAddMemberVisible, setAddMemberVisible] = useState(false);
  const [appConfirm, setAppConfirm] = useState();

  const apps = useActiveApp();

  const findRoom = () => {
    if (uiStore.resourceType !== 'f') {
      return roomStore.getRoomMap().get(uiStore.resourceId);
    }
    return null;
  };

  const getRoomName = () => {
    const found = findRoom();
    if (found) {
      if (found?.type === 'WKS0001') {
        return userStore.myProfile.displayName;
      }
      if (found?.customName || found?.name) {
        return found?.customName || found?.name;
      }
    }

    return null;
  };

  const isMyRoom = () => {
    const found = findRoom();
    return found?.type === 'WKS0001';
  };

  const isDMRoom = () => {
    const found = findRoom();
    return !!found?.isDirectMsg;
  };

  const getUserCount = () => {
    const found = findRoom();
    if (found && found?.userCount) {
      return found.userCount;
    }
    return null;
  };

  const getUserPhotos = () => {
    const found = findRoom();
    if (found && found?.memberIdListString) {
      const userIdArr = found?.memberIdListString.split(',');
      const userIds =
        userIdArr.length === 1
          ? userIdArr
          : userIdArr
              .filter(userId => userId !== userStore.myProfile.id)
              .splice(0, 4);

      return userIds.map(
        userId => `${userStore.getProfilePhotoURL(userId, 'small')}`,
      );
    }
    return [];
  };

  const handleExport = () => {
    const roomInfo = findRoom();

    uiStore.openWindow({
      id: roomInfo.id,
      type: 'talk',
      name: roomInfo.name,
      userCount: roomInfo.userCount,
      handler: null,
    });
  };

  const handleSearch = () => EventBus.dispatch('Talk:OpenSearch');

  const openSubApp = async appName => {
    const queryParams = { ...getQueryParams(), sub: appName };
    const queryString = getQueryString(queryParams);

    if (uiStore.resourceType === 'f') {
      try {
        const response = await roomStore.getDMRoom(
          userStore.myProfile.id,
          userStore.myProfile.id,
        );
        if (!response.result) {
          throw Error('DM ROOM GET FAILED');
        }
        history.push(`/s/${response.roomInfo.id}/talk?${queryString}`);
      } catch (e) {
        console.error(`Error is${e}`);
      }
    } else {
      history.push(`${history.location.pathname}?${queryString}`);
    }
  };

  const closeSubApp = () => {
    const queryParams = getQueryParams();
    delete queryParams.sub;
    const queryString = getQueryString(queryParams);

    history.push(`${history.location.pathname}?${queryString}`);
  };

  const openMeeting = () => {
    const roomInfo = findRoom();

    uiStore.openWindow({
      id: roomInfo.id,
      type: 'meeting',
      name: null,
      userCount: null,
      handler: null,
    });
  };

  const handleAppClick = async appName => {
    if (appName === 'meeting') {
      const { id } = findRoom();
      const meetingWindow = uiStore.getWindow('meeting', id);
      if (meetingWindow) {
        uiStore.focusWindow('meeting', id);
      } else {
        const meetingAppConfirm = (
          <MeetingApp.ConfirmLaunchApp
            language={i18n.language}
            onConfirm={() => {
              setAppConfirm(null);
              openMeeting();

              // openSubApp(appName);
            }}
            onCancel={() => {
              setAppConfirm(null);
            }}
          />
        );
        setAppConfirm(meetingAppConfirm);
      }
    } else if (uiStore.subApp !== appName) {
      openSubApp(appName);
    } else {
      closeSubApp();
    }

    switch (appName) {
      case 'drive':
        logEvent('gnb', 'clickTeeDriveBtn');
        break;
      case 'calendar':
        logEvent('gnb', 'clickTeeCalendarBtn');
        break;
      case 'note':
        logEvent('gnb', 'clickTeeNoteBtn');
        break;
      case 'meeting':
        logEvent('gnb', 'clickTeeMeetingBtn');
        break;
      case 'files':
        logEvent('gnb', 'clickPlusBtn');
        break;
      default:
        break;
    }
  };

  const handleClickRoomPhoto = useCallback(() => {
    setRoomProfileVisible(true);
  }, []);

  const handleCancelRoomMemeberModal = useCallback(() => {
    setRoomProfileVisible(false);
  }, []);

  const handleAddMember = () => {
    setAddMemberVisible(true);
  };

  const handleInviteUsers = async (_, resultRoomId) => {
    // 1:1 룸에 초대한 경우 새로운 룸이 생성되는데, 이 경우 그 룸으로 이동해야함.
    if (findRoom()?.id !== resultRoomId) {
      history.push(`/s/${resultRoomId}/talk`);
    }

    setAddMemberVisible(false);
  };

  const handleCancelInviteUsers = () => {
    setAddMemberVisible(false);
  };

  const currRoomInfo = findRoom();
  let profileModal;

  if (isMyRoom()) {
    profileModal = (
      <ProfileInfoModal
        userId={userStore.myProfile.id}
        visible={isRoomProfileVisible}
        onClickMeeting={_roomId => {
          uiStore.openWindow({
            id: _roomId,
            type: 'meeting',
            name: null,
            userCount: null,
            handler: null,
          });
        }}
        onClose={handleCancelRoomMemeberModal}
        position={{ top: '3.5rem', left: '17rem' }}
      />
    );
  } else if (currRoomInfo?.userCount === 2) {
    const dmUserId = currRoomInfo.memberIdListString
      .split(',')
      .find(userId => userId !== userStore.myProfile.id);

    profileModal = (
      <ProfileInfoModal
        userId={dmUserId}
        visible={isRoomProfileVisible}
        onClose={handleCancelRoomMemeberModal}
        onClickMeeting={_roomId => {
          uiStore.openWindow({
            id: _roomId,
            type: 'meeting',
            name: null,
            userCount: null,
            handler: null,
          });
        }}
        position={{ top: '3.5rem', left: '17rem' }}
      />
    );
  } else {
    profileModal = (
      <RoomInquiryModal
        roomId={findRoom()?.id}
        visible={isRoomProfileVisible}
        onCancel={handleCancelRoomMemeberModal}
        width="17.5rem"
        top="3.5rem"
        left="17rem"
      />
    );
  }

  return (
    <Wrapper>
      <TitleWrapper>
        {uiStore.resourceType !== 'f' && (
          <>
            <Title>
              <StyledPhotos
                className="header__photo"
                srcList={getUserPhotos()}
                onClick={handleClickRoomPhoto}
              />
              {findRoom()?.type === 'WKS0003' && (
                <div style={{ display: 'flex', marginRight: '0.25rem' }}>
                  <OpenChatBgIcon
                    width={1.125}
                    height={1.125}
                    color="rgb(0, 73, 61)"
                  />
                </div>
              )}
              <TitleText>{getRoomName()}</TitleText>
              {!(isMyRoom() || isDMRoom()) ? (
                <UserCountText>{getUserCount()}</UserCountText>
              ) : null}
              {profileModal}
            </Title>

            {uiStore.resourceType !== 'm' && (
              <SystemIconContainer>
                {uiStore.layout !== 'expand' && (
                  <>
                    <Tooltip
                      placement="bottom"
                      title={t('CM_TEMP_MINI_CHAT')}
                      color="#4C535D"
                    >
                      <IconWrapper
                        className="header__export-button"
                        onClick={handleExport}
                      >
                        <ExportIcon
                          width={1.25}
                          height={1.25}
                          color="#232D3B"
                        />
                      </IconWrapper>
                    </Tooltip>
                    <Tooltip
                      placement="bottom"
                      title={t('CM_ROOMTITLE_TOOLTIP_02')}
                      color="#4C535D"
                    >
                      <IconWrapper
                        className="header__search-button"
                        onClick={handleSearch}
                      >
                        <SearchIcon
                          width={1.25}
                          height={1.25}
                          color="#232D3B"
                        />
                      </IconWrapper>
                    </Tooltip>
                  </>
                )}
                {!isMyRoom() && userStore.myProfile?.isGuest === false && (
                  <>
                    <Tooltip
                      placement="bottom"
                      title={t('CM_ROOM_INVITE_USER')}
                      color="#4C535D"
                    >
                      <IconWrapper
                        className="header__invite-button"
                        onClick={handleAddMember}
                      >
                        <AddAcountIcon
                          width={1.25}
                          height={1.25}
                          color="#232D3B"
                        />
                      </IconWrapper>
                    </Tooltip>

                    <RoomAddMemberModal
                      visible={isAddMemberVisible}
                      roomId={findRoom()?.id}
                      onInviteUsers={handleInviteUsers}
                      onCancel={handleCancelInviteUsers}
                    />
                  </>
                )}
              </SystemIconContainer>
            )}
          </>
        )}
      </TitleWrapper>

      <AppIconContainer>
        {appConfirm}
        {apps.map(
          ({
            name,
            i18n,
            icons,
            isUsedInMyRoom,
            isSeperated,
            isUsedInProfile,
          }) => (
            <AppIconbutton key={name}>
              {isSeperated ? <VerticalBar /> : null}
              <AppIcon
                key={name}
                // isActive={uiStore.subApp === name}
                isActive={
                  name !== 'meeting'
                    ? uiStore.subApp === name
                    : !!uiStore.getWindow('meeting', findRoom()?.id)
                }
                appName={name}
                i18n={i18n}
                onClick={handleAppClick}
                defaultIcon={icons.default}
                activeIcon={icons.active}
                disabledIcon={icons.disabled}
                disabled={
                  (isMyRoom() && !isUsedInMyRoom) ||
                  (uiStore.resourceType === 'f' && !isUsedInProfile)
                }
              />
            </AppIconbutton>
          ),
        )}
      </AppIconContainer>

      <UserMenu>
        <HeaderProfile />
      </UserMenu>
    </Wrapper>
  );
});

export default Header;
