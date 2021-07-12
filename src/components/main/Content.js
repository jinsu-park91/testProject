import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Observer } from 'mobx-react';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { MailMainView, MailSubView } from 'teespace-mail-app';
import { DriveApp, DriveAllApp } from 'teespace-drive-app';
import { App as MeetingApp } from 'teespace-meeting-app';
import { useCoreStores, AppState } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { throttle } from 'lodash';
import RoomSetting from '../Rooms/RoomSetting';
import { useStores } from '../../stores';
import { Wrapper, Splitter } from './ContentStyle';
import { MainAppContainer, SubAppContainer } from './AppContainer';
import MainProfile from '../profile/MainProfile';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const Content = () => {
  const { i18n } = useTranslation();
  const { userStore, roomStore } = useCoreStores();
  const { uiStore } = useStores();
  const history = useHistory();
  const splitRef = useRef(null);
  const contentRef = useRef(null);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    if (contentRef) {
      uiStore.content.rect = contentRef.current.getBoundingClientRect();
    }
  });

  const getRoomId = () => {
    if (uiStore.resourceType !== 'f') {
      return uiStore.resourceId;
    }
    return null;
  };

  const getChannelId = type => {
    const roomId = getRoomId();
    if (uiStore.resourceType !== 'f') {
      return roomStore
        .getRoomMap()
        .get(roomId)
        ?.channelList?.find(channel => channel.type === type)?.id;
    }
    return null;
  };

  const handleSplitDrag = throttle(sizes => {
    uiStore.sizes = sizes;
  }, 200);

  const handleSplitDragStart = () => {
    const splitter = splitRef?.current?.parent;
    const gutter = splitter.childNodes[1];

    if (gutter) {
      gutter.classList.add('gutter--active');
    }
  };

  const handleSplitDragEnd = () => {
    const splitter = splitRef?.current?.parent;
    const gutter = splitter.childNodes[1];

    if (gutter) {
      gutter.classList.remove('gutter--active');
    }
  };

  const getApplication = appName => {
    switch (appName) {
      case 'talk':
        return (
          <Talk
            roomId={getRoomId()}
            channelId={getChannelId('CHN0001')}
            layoutState={uiStore.layout}
            language={i18n.language}
            isMini={false}
          />
        );
      case 'note':
        return (
          <NoteApp
            roomId={getRoomId()}
            language={i18n.language}
            channelId={getChannelId('CHN0003')}
            layoutState={uiStore.layout}
          />
        );
      case 'drive':
        return (
          <DriveApp
            userId={myUserId}
            roomId={getRoomId()}
            language={i18n.language}
            channelId={getChannelId('CHN0006')}
            layoutState={uiStore.layout}
          />
        );
      case 'files':
        return (
          <DriveAllApp
            userId={myUserId}
            roomId={getRoomId()}
            language={i18n.language}
            channelId={getChannelId('CHN0006')}
            layoutState={uiStore.layout}
          />
        );
      case 'calendar':
        return (
          <CalendarApp
            roomId={getRoomId()}
            language={i18n.language}
            channelId={getChannelId('CHN0005')}
            layoutState={uiStore.layout}
          />
        );
      case 'meeting':
        return (
          <MeetingApp
            roomId={getRoomId()}
            language={i18n.language}
            channelId={getChannelId('CHN0005')}
            layoutState={uiStore.layout}
            appState={uiStore.subAppState}
            onChangeAppState={state => {
              uiStore.subAppState = state;
              if (state === AppState.STOPPED) {
                history.push(uiStore.nextLocation);
              }
            }}
          />
        );
      case 'mail':
        return <MailMainView roomId={getRoomId()} language={i18n.language} />;
      case 'mailsub':
        return <MailSubView roomId={getRoomId()} language={i18n.language} />;
      case 'profile':
        return <MainProfile userId={uiStore.resourceId} />;
      case 'setting':
        return <RoomSetting roomId={getRoomId()} />;
      default:
        return null;
    }
  };

  return (
    <Wrapper ref={contentRef}>
      <Observer>
        {() => {
          const width = window.innerWidth;
          const mainDefaultWidth = 50 - (remToPixel(16.19) * 100) / width;
          const subDefaultWidth = 100 - mainDefaultWidth;

          const mainMinWidth = width / 2 - remToPixel(16.19);
          const subMinWidth = (width * 2) / 7;

          return (
            <Splitter
              sizes={
                uiStore.resourceType === 'm'
                  ? [38, 62]
                  : [mainDefaultWidth, subDefaultWidth]
              }
              minSize={[mainMinWidth, subMinWidth]}
              gutter={() => {
                const gutter = document.createElement('div');
                gutter.classList.add('gutter', 'gutter-horizontal');

                const rect = document.createElement('span');
                rect.classList.add('gutter__rect');

                gutter.appendChild(rect);
                return gutter;
              }}
              gutterStyle={() => {
                return {
                  width: '0.3125rem',
                };
              }}
              onDragStart={handleSplitDragStart}
              onDragEnd={handleSplitDragEnd}
              onDrag={handleSplitDrag}
              ref={splitRef}
            >
              <MainAppContainer>
                {getApplication(uiStore.mainApp)}
              </MainAppContainer>

              <SubAppContainer layoutState={uiStore.layout} splitRef={splitRef}>
                {getApplication(uiStore.subApp)}
              </SubAppContainer>
            </Splitter>
          );
        }}
      </Observer>
    </Wrapper>
  );
};

export default Content;
