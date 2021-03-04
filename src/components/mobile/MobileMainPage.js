import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useCoreStores } from 'teespace-core';
import { talkRoomStore } from 'teespace-talk-app';
import styled from 'styled-components';
import MobileHeader from './MobileHeader';
import MobileContent from './MobileContent';
import MobileFooter from './MobileFooter';
import LoadingImg from '../../assets/WAPL_Loading.gif';
import PlatformUIStore from '../../stores/PlatformUIStore';

const Wrapper = styled.div`
  height: 100%;
`;
const Container = styled.div`
  padding-top: 3.1rem;
  height: 95%;
  overflow-y: scroll;
`;

const Loader = styled.div``;

const MobileMainPage = observer(() => {
  const { resourceType, resourceId } = useParams();
  const { userStore, friendStore, roomStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const myUserId = userStore.myProfile.id;

  useEffect(() => {
    Promise.all([
      userStore.fetchRoomUserProfileList({}),
      friendStore.fetchFriends({ myUserId }),
      roomStore.fetchRoomList({ myUserId }),
    ]).then(async () => {
      await talkRoomStore.initialize(myUserId);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    PlatformUIStore.resourceType = resourceType;
    if (resourceId) PlatformUIStore.resourceId = resourceId;
    // 임시... route 고민
    else PlatformUIStore.resourceId = myUserId;
  }, [resourceType, resourceId, myUserId]);

  if (isLoading) {
    return (
      <Loader>
        <img src={LoadingImg} alt="loading" />
      </Loader>
    );
  }

  return (
    <>
      <Wrapper>
        <Container>
          <MobileHeader />
          <MobileContent />
        </Container>
        <MobileFooter />
      </Wrapper>
    </>
  );
});

export default MobileMainPage;
