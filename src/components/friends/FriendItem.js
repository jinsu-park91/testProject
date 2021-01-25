import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import { Button } from 'antd';
import {
  useCoreStores,
  Dropdown,
  Menu,
  Message,
  Toast,
  usePortalWindow,
} from 'teespace-core';
import { useOpenInWindow } from 'use-open-window';
import { ExportOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Talk } from 'teespace-talk-app';
import { handleCheckNewFriend } from '../../utils/FriendsUtil';
import { ViewMoreIcon, ExportIcon } from '../Icons';
import mySign from '../../assets/wapl_me.svg';

const FriendItemWrapper = styled.div`
  /* 조직도 조회, 추천친구 스타일 */
  height: 3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  ${props =>
    (props.mode === 'addFriend' || props.mode === 'recommended') &&
    css`
      width: calc(100% - 1.5rem + 8px);
      display: flex;
      flex-direction: row;
      background-color: transparent;
      border-bottom: 1px solid #e3e7eb;
      padding: 0 0.63rem;
      margin-left: 0.75rem;
      margin-right: calc(0.75rem - 8px);

      &:hover {
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      }

      /* icon */
      .ant-btn-circle {
        background: transparent;
        box-shadow: 0;
        border: 0;
        color: #75757f;
        &:hover {
          color: #75757f;
          background-color: #dcddff;
        }
      }
    `}

  /* 내 프로필 아이템과 친구 아이템의 스타일 */
  ${props =>
    (props.mode === 'me' || props.mode === 'friend') &&
    css`
      display: flex;
      flex-direction: row;
      margin: 0 0.25rem;
      padding: 0 0.38rem;

      ${props.isActive
        ? css`
            background-color: #f2efec;
            border-radius: 0.81rem;
          `
        : css`
            &:hover {
              background-color: #faf8f7;
              border-radius: 0.81rem;
            }
          `}

      /* icon */
      .ant-btn-circle {
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        box-shadow: none;
        border: 0;
        color: #75757f;
        &:hover {
          background-color: #dcddff;
        }
        &:active,
        &:focus {
          background-color: transparent;
        }
      }
    `}
`;

const ProfileWrapper = styled.div`
  align-items: center;
  display: flex;

  /* me badge */
  .ant-badge-count {
    margin-left: -2.125rem;
  }
`;

const TextWrapper = styled.div`
  margin-left: 0.4375rem;
  flex-grow: 1;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TitleForName = styled.span`
  font-weight: 600;
  font-size: 0.81rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledWrapper = styled.div`
  position: relative;
`;

const NewFriendBadge = styled.div`
  height: 1rem;
  width: 1rem;
  line-height: 1rem;
  font-size: 0.63rem;
  color: #fff;
  font-weight: 400;
  text-align: center;
  border-radius: 50%;
  background-color: #dc4547;
`;

const StyledAvatar = styled.div`
  position: relative;
  ${props => {
    switch (props.mode) {
      case 'me':
        return css`
          width: 2.38rem;
          height: 2.38rem;
          border: 2px solid #fff;
        `;
      case 'addFriend':
        return css`
          width: 2rem;
          height: 2rem;
        `;
      case 'friend':
      default:
        return css`
          width: 2.125rem;
          height: 2.125rem;
        `;
    }
  }}
  border-radius: 50%;
  background-color: #fff;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const MeWrapper = styled.div`
  margin-left: 0.25rem;
`;

const MoreIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  &:hover {
    background-color: #eae6e0;
  }
`;

const DropdownMenu = React.memo(
  ({
    friendFavorite,
    handleCancelBookmark,
    handleAddBookmark,
    handleRemoveFriendMessageOpen,
  }) => (
    <Menu>
      {friendFavorite && (
        <Menu.Item onClick={handleCancelBookmark}>즐겨찾기 해제</Menu.Item>
      )}
      {!friendFavorite && (
        <Menu.Item onClick={handleAddBookmark}>즐겨찾기</Menu.Item>
      )}
      <Menu.Item onClick={handleRemoveFriendMessageOpen}>프렌즈 삭제</Menu.Item>
    </Menu>
  ),
);

const Profile = React.memo(
  ({ mode, tooltipPopupContainer, profilePhoto, itemId, handleClickPhoto }) => {
    return (
      <>
        {mode === 'me' && (
          <StyledWrapper>
            <StyledAvatar mode="me" onClick={e => handleClickPhoto(e, itemId)}>
              <img src={profilePhoto} alt="" />
            </StyledAvatar>
          </StyledWrapper>
        )}
        {mode !== 'me' && (
          <StyledAvatar mode={mode} onClick={e => handleClickPhoto(e, itemId)}>
            <img src={profilePhoto} alt="" />
          </StyledAvatar>
        )}
      </>
    );
  },
);

const FriendAction = React.memo(
  ({ mode, menu, handleDropdownVisible, handleTalkWindowOpen }) => {
    const handleOpenTalk = useCallback(e => {
      e.stopPropagation();
      console.log(handleTalkWindowOpen());
    }, []);

    return (
      <>
        {mode === 'friend' && (
          <>
            <Dropdown
              overlay={menu}
              trigger={['click']}
              onClick={e => e.stopPropagation()}
              onVisibleChange={handleDropdownVisible}
            >
              <MoreIconWrapper>
                <ViewMoreIcon />
              </MoreIconWrapper>
            </Dropdown>
            {/* 미니챗 기능 추후 업데이트 */}
            {/* <Button
              shape="circle"
              icon={<ExportIcon />}
              onClick={handleOpenTalk}
            /> */}
          </>
        )}
      </>
    );
  },
);

const MeAction = React.memo(({ mode, handleTalkWindowOpen }) => {
  return (
    <>
      {/* {mode === 'me' && (
        <Button
          shape="circle"
          icon={<ExportIcon />}
          onClick={handleTalkWindowOpen}
        />
      )} */}
    </>
  );
});

const AddFriendAction = React.memo(
  ({ mode, friendRelation, handleAddFriend, isMe }) => (
    <>
      {mode === 'addFriend' && !friendRelation && !isMe && (
        <Button
          shape="circle"
          icon={<PlusOutlined onClick={handleAddFriend} />}
        />
      )}
    </>
  ),
);

const RecommendedAction = React.memo(
  ({ mode, friendRelation, handleAddFriend }) => (
    <>
      {mode === 'recommended' && !friendRelation && (
        <>
          <Button
            shape="circle"
            icon={<PlusOutlined onClick={handleAddFriend} />}
          />
          <Button shape="circle" icon={<CloseOutlined />} />
        </>
      )}
    </>
  ),
);

const Action = React.memo(
  ({
    mode,
    isHovering,
    menu,
    handleDropdownVisible,
    handleTalkWindowOpen,
    friendRelation,
    handleAddFriend,
    isMe,
  }) => (
    <>
      {mode !== 'readOnly' && isHovering && (
        <>
          <FriendAction
            mode={mode}
            menu={menu}
            handleDropdownVisible={handleDropdownVisible}
            handleTalkWindowOpen={handleTalkWindowOpen}
          />
          <MeAction mode={mode} handleTalkWindowOpen={handleTalkWindowOpen} />
          <AddFriendAction
            mode={mode}
            friendRelation={friendRelation}
            handleAddFriend={handleAddFriend}
            isMe={isMe}
          />
          <RecommendedAction
            mode={mode}
            friendRelation={friendRelation}
            handleAddFriend={handleAddFriend}
          />
        </>
      )}
    </>
  ),
);

const TextComponent = React.memo(
  ({ displayName, fullCompanyJob, mode, orgName, position }) => {
    const fullDisplayName = (() => {
      // friend는 Friend 목록에서 조회한 UserModel을 사용
      // addFriend (organization)은 Org 목록에서 조회한 UserModel을 사용
      // 둘이 fullCompanyJob 규칙이 살짝 다르다.
      switch (mode) {
        // friends LNB
        case 'friend': {
          // const orgInfoList = fullCompanyJob
          //   ?.split(', ')
          //   .map(jobTitle => jobTitle.trim().split(' ').join('-'))
          //   .filter(jobTitleStr => jobTitleStr?.length > 0);

          // if (orgInfoList?.length > 0) {
          //   return `${displayName} (${orgInfoList.join(', ')})`;
          // }
          const fullCompanyJobTxt = fullCompanyJob ? `(${fullCompanyJob})` : '';
          return `${displayName} ${fullCompanyJobTxt}`;
        }
        case 'addFriend': // organization
          if (orgName && position) {
            return `${displayName} (${orgName}·${position})`;
          }
          return displayName;
        default:
          return displayName;
      }
    })();

    return (
      <>
        <TitleForName>{fullDisplayName}</TitleForName>
        {mode === 'me' && (
          <MeWrapper>
            <img src={mySign} alt="me" />
          </MeWrapper>
        )}
      </>
    );
  },
);

/**
 * A friend item component to use in the list view.
 * @param {Object} props
 * @param {('me'|'friend'|'readOnly'|'addFriend'|'recommended')} props.mode
 * @param {function} props.tooltipPopupContainer
 * @param {UserModel} props.friendInfo
 */
const FriendItem = observer(
  ({
    mode = 'friend', // 'me', 'friend' // 추후: 'readOnly', 'addFriend', 'recommended'
    isActive = false,
    onClick,
    tooltipPopupContainer = () => document.body,
    friendInfo,
    style,
    openToast,
    setToastText,
    setSelectedId,
    toggleInfoModal,
    setxPosition,
    setyPosition,
  }) => {
    const {
      displayName,
      friendFavorite = false,
      friendId = '',
      id: userId = '',
      orgName,
      position,
    } = friendInfo;
    const fullCompanyJob = friendInfo.getFullCompanyJob({ format: 'friend' });
    const history = useHistory();
    const { friendStore, userStore, roomStore } = useCoreStores();

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [mouseOutWithDropdown, setMouseOutWithDropdown] = useState(false);
    const [
      visibleRemoveFriendMessage,
      setVisibleRemoveFriendMessage,
    ] = useState(false);
    const [addFriendToastVisible, setAddFriendToastVisible] = useState(false);

    const myUserId = userStore.myProfile.id;
    const itemId = friendId || userId;
    const isMe = itemId === myUserId;
    const isNewFriend = handleCheckNewFriend(friendInfo);

    const handleSelectPhoto = (e, id = '') => {
      setxPosition(e.clientX);
      setyPosition(e.clientY);
      if (e) e.stopPropagation();
      if (id) {
        setSelectedId(id);
        toggleInfoModal(true);
      } else {
        toggleInfoModal(false);
      }
    };

    const talkWindowOpen = usePortalWindow();

    const handleTalkWindowOpen = async e => {
      if (e) e.stopPropagation();
      try {
        const targetId = friendInfo.friendId || myUserId;
        const { roomInfo } = await roomStore.getDMRoom(myUserId, targetId);

        if (roomInfo) {
          if (!roomInfo.isVisible) {
            await roomStore.updateRoomMemberSetting({
              roomId: roomInfo.id,
              myUserId,
              newIsVisible: true,
            });
          }
          talkWindowOpen({
            element: (
              <Talk
                roomId={roomInfo.id}
                channelId={
                  roomStore
                    .getRoomMap()
                    .get(roomInfo.id)
                    ?.channelList?.find(channel => channel.type === 'CHN0001')
                    ?.id
                }
              />
            ),
            opts: 'width=600, height=900',
            title: 'mini-talk',
          });
        } else {
          const { dmRoomId } = await roomStore.createRoom({
            creatorId: myUserId,
            userList:
              myUserId === targetId
                ? [{ userId: myUserId }]
                : [{ userId: myUserId }, { userId: targetId }],
          });
          talkWindowOpen({
            element: (
              <Talk
                roomId={dmRoomId}
                channelId={
                  roomStore
                    .getRoomMap()
                    .get(dmRoomId)
                    ?.channelList?.find(channel => channel.type === 'CHN0001')
                    ?.id
                }
              />
            ),
            opts: 'width=600, height=900',
            title: 'mini-talk',
          });
        }
      } catch (e) {
        console.error(`Error is${e}`);
      }
    };

    const handleDropdownVisible = useCallback(
      visible => {
        if (mouseOutWithDropdown) {
          setIsHovering(false);
          setMouseOutWithDropdown(false);
        }
        setDropdownVisible(visible);
      },
      [mouseOutWithDropdown],
    );

    const handleMouseEnter = useCallback(() => {
      setIsHovering(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      if (dropdownVisible) {
        setMouseOutWithDropdown(true);
      } else {
        setIsHovering(false);
      }
    }, [dropdownVisible]);

    const handleAddBookmark = useCallback(
      async ({ domEvent: e }) => {
        e.stopPropagation();
        try {
          await friendStore.setFriendFavorite({
            myUserId,
            friendId: itemId,
            isFav: true,
          });
        } catch (error) {
          console.log(error);
        }
        setIsHovering(false);
        setDropdownVisible(false);
        setToastText('즐겨찾기가 설정되었습니다.');
        openToast();
      },
      [friendStore, itemId, setToastText, openToast, myUserId],
    );

    const handleCancelBookmark = useCallback(
      async ({ domEvent: e }) => {
        e.stopPropagation();
        await friendStore.setFriendFavorite({
          myUserId,
          friendId: itemId,
          isFav: false,
        });
        setToastText('즐겨찾기가 해제되었습니다.');
        openToast();
      },
      [friendStore, myUserId, itemId, setToastText, openToast],
    );

    const handleMoveItem = useCallback(
      targetId => {
        if (onClick) onClick(targetId);
        if (mode === 'me' || mode === 'friend') {
          history.push({
            pathname: `/f/${targetId}/profile`,
            search: null,
          });
        }
      },
      [onClick, mode, history],
    );

    const handleItemClick = useCallback(
      e => {
        if (e) e.stopPropagation();
        handleMoveItem(itemId);
      },
      [itemId, handleMoveItem],
    );

    const handleRemoveFriend = useCallback(
      async e => {
        e.stopPropagation();
        setVisibleRemoveFriendMessage(false);
        await friendStore.deleteFriend({
          myUserId,
          friendId: itemId,
        });
        handleMoveItem(myUserId);
      },
      [friendStore, myUserId, itemId, handleMoveItem],
    );

    const handleAddFriend = useCallback(() => {
      friendStore.addFriend({
        myUserId,
        friendInfo,
      });
      setAddFriendToastVisible(true);
    }, [friendStore, myUserId, friendInfo]);

    const handleCloseToast = useCallback(() => {
      setAddFriendToastVisible(false);
    }, []);

    const getRemoveFriendMessageTitle = useCallback(() => {
      if (fullCompanyJob) {
        return `${displayName}(${fullCompanyJob}) \\n 님을 프렌즈 목록에서 삭제하시겠습니까?`;
      }
      return `${displayName} 님을 프렌즈 목록에서 \\n 삭제하시겠습니까?`;
    }, [displayName, fullCompanyJob]);

    const handleRemoveFriendMessageOpen = useCallback(({ domEvent: e }) => {
      if (e) e.stopPropagation();
      setIsHovering(false);
      setDropdownVisible(false);
      setVisibleRemoveFriendMessage(true);
    }, []);

    const handleRemoveFriendMessageClose = useCallback(e => {
      if (e) e.stopPropagation();
      setVisibleRemoveFriendMessage(false);
    }, []);

    return (
      <>
        <FriendItemWrapper
          style={style}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleItemClick}
          isActive={isActive}
          mode={mode}
        >
          <ProfileWrapper>
            <Profile
              mode={mode}
              tooltipPopupContainer={tooltipPopupContainer}
              profilePhoto={userStore.getProfilePhotoURL(itemId, 'small')}
              itemId={itemId}
              handleClickPhoto={handleSelectPhoto}
            />
          </ProfileWrapper>
          <TextWrapper>
            <TextComponent
              displayName={displayName}
              fullCompanyJob={fullCompanyJob}
              mode={mode}
              orgName={orgName}
              position={position}
            />
          </TextWrapper>
          <ActionWrapper>
            {!isHovering && isNewFriend && <NewFriendBadge> N </NewFriendBadge>}
            <Action
              mode={mode}
              isHovering={isHovering}
              menu={
                <DropdownMenu
                  friendFavorite={friendFavorite}
                  handleCancelBookmark={handleCancelBookmark}
                  handleAddBookmark={handleAddBookmark}
                  handleRemoveFriendMessageOpen={handleRemoveFriendMessageOpen}
                />
              }
              handleDropdownVisible={handleDropdownVisible}
              handleTalkWindowOpen={handleTalkWindowOpen}
              friendRelation={friendStore.checkAlreadyFriend({
                userId: itemId,
              })}
              handleAddFriend={handleAddFriend}
              isMe={isMe}
            />
            {mode === 'addFriend' && isMe && <span>내 계정</span>}
          </ActionWrapper>
        </FriendItemWrapper>
        <Toast
          visible={addFriendToastVisible}
          timeoutMs={1000}
          onClose={handleCloseToast}
        >
          {`${displayName}님이 프렌즈로 추가되었습니다`}
        </Toast>
        <Message
          visible={visibleRemoveFriendMessage}
          title={getRemoveFriendMessageTitle()}
          type="error"
          btns={[
            {
              text: '삭제',
              type: 'solid',
              onClick: handleRemoveFriend,
            },
            {
              text: '취소',
              type: 'outlined',
              onClick: handleRemoveFriendMessageClose,
            },
          ]}
        />
      </>
    );
  },
);

export default FriendItem;
