import React, { useRef, useCallback } from 'react';
import { Observer } from 'mobx-react';
import { Talk } from 'teespace-talk-app';
import { NoteApp } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { MailMainView, MailSubView } from 'teespace-mail-app';
import { DriveApp } from 'teespace-drive-app';
import { MeetingApp } from 'teespace-meeting-app';
import { useCoreStores } from 'teespace-core';
import RoomSetting from '../Rooms/RoomSetting';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { Wrapper, Splitter } from './ContentStyle';
import { MainAppContainer, SubAppContainer } from './AppContainer';
import Profile from '../Profile';

const Content = () => {
  const splitRef = useRef(null);
  const { roomStore } = useCoreStores();

  const getRoomId = () => {
    if (PlatformUIStore.resourceType === 's') {
      return PlatformUIStore.resourceId;
    }
    return null;
  };

  const getChannelId = type => {
    if (PlatformUIStore.resourceType === 's') {
      return roomStore
        .getRoomMap()
        .get(PlatformUIStore.resourceId)
        ?.channelList?.find(channel => channel.type === type)?.id;
    }
    return null;
  };

  const getApplication = appName => {
    switch (appName) {
      case 'talk':
        return (
          <Talk
            roomId={getRoomId()}
            channelId={getChannelId('CHN0001')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'note':
        return (
          <NoteApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0003')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'drive':
        return (
          <DriveApp
            isDrive
            roomId={getRoomId()}
            channelId={getChannelId('CHN0006')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'files':
        return (
          <DriveApp
            isDrive={false}
            roomId={getRoomId()}
            channelId={getChannelId('CHN0006')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'calendar':
        return (
          <CalendarApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0005')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'meeting':
        return (
          <MeetingApp
            roomId={getRoomId()}
            channelId={getChannelId('CHN0005')}
            layoutState={PlatformUIStore.layout}
          />
        );
      case 'mail':
        return <MailMainView />;
      case 'mailsub':
        return <MailSubView />;
      case 'profile':
        return <Profile userId={PlatformUIStore.resourceId} />;
      case 'setting':
        return (
          <RoomSetting roomInfo={roomStore.getRoomMap().get(getRoomId())} />
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Observer>
        {() => (
          <Splitter
            sizes={PlatformUIStore.resourceType === 'm' ? [38, 62] : [75, 25]}
            minSize={500}
            gutterSize={10}
            ref={splitRef}
          >
            <MainAppContainer>
              {getApplication(PlatformUIStore.mainApp)}
            </MainAppContainer>

            <SubAppContainer
              layoutState={PlatformUIStore.layout}
              splitRef={splitRef}
            >
              {getApplication(PlatformUIStore.subApp)}
            </SubAppContainer>
          </Splitter>
        )}
      </Observer>
    </Wrapper>
  );
};

export default Content;
