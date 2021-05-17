import React, { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { useCoreStores, Tooltip } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Modal, Dropdown, Menu } from 'antd';
import { Observer } from 'mobx-react';
import MovePage from '../../utils/MovePage';
import { getMainWaplURL } from '../../utils/UrlUtil';
import { remToPixel } from '../../utils/GeneralUtil';
import {
  Wrapper,
  ItemWrapper,
  HorizontalBar,
  SpaceBox,
  UnreadSpaceNumber,
  DropdownWrapper,
} from './SpaceSideStyle';
import { HomeIcon, HorizontalViewMoreIcon, AddIcon } from '../Icons';

const SpaceItem = React.memo(
  ({ checked, spaceName, spaceUnreadCount, spaceDomain }) => {
    return (
      <Tooltip title={spaceName} placement="right" color="#4C535D">
        <SpaceBox
          checked={checked}
          onClick={() => {
            window.location.href = `${window.location.protocol}//${spaceDomain}`;
          }}
        >
          {spaceUnreadCount > 0 && (
            <UnreadSpaceNumber>
              {spaceUnreadCount > 99 ? '99+' : spaceUnreadCount}
            </UnreadSpaceNumber>
          )}
          {spaceName[0]}
        </SpaceBox>
      </Tooltip>
    );
  },
);

const SpaceDropdownItem = React.memo(
  ({ checked, spaceName, spaceUnreadCount, spaceDomain }) => {
    return (
      <DropdownWrapper
        onClick={() => {
          window.location.href = `${window.location.protocol}//${spaceDomain}`;
        }}
      >
        <SpaceBox checked={checked} isDropdown>
          {spaceUnreadCount > 0 && (
            <UnreadSpaceNumber>
              {spaceUnreadCount > 99 ? '99+' : spaceUnreadCount}
            </UnreadSpaceNumber>
          )}
          {spaceName[0]}
        </SpaceBox>
        {spaceName}
      </DropdownWrapper>
    );
  },
);

const SpaceSide = () => {
  const { t } = useTranslation();
  const { userStore, spaceStore } = useCoreStores();
  const { spaceList } = spaceStore;
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const spaceNum = spaceList.length;
  const viewNum = Math.floor(windowHeight / remToPixel(2.813)) - 2;

  const lnbSpace = spaceNum > viewNum ? spaceList.slice(0, viewNum) : spaceList;
  const dropdownSpace = spaceNum > viewNum ? spaceList.slice(viewNum) : [];

  const resizeWindow = throttle(() => {
    setWindowHeight(window.innerHeight);
  }, 200);

  useEffect(() => {
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewSpace = () => {
    const adminSpace = spaceStore.getAdminSpaces({
      loginId: userStore.myProfile.loginId,
    });
    if (adminSpace.length >= 3) {
      Modal.info({
        mask: false,
        centered: true,
        width: '22.5rem',
        title: t('CM_SPACE_CREATE_OPTION_ERROR_03'),
        okText: t('CM_LOGIN_POLICY_03'),
      });
    } else window.location.href = getMainWaplURL('/select-space-type');
  };

  return (
    <Wrapper>
      <Tooltip title={t('CM_GO_SPACES')} placement="right" color="#4C535D">
        <ItemWrapper
          background="#fff"
          style={{ marginTop: '0.55rem' }}
          onClick={() => MovePage('spaces')}
        >
          <HomeIcon width={1.5} height={1.5} color="#232d3b" />
        </ItemWrapper>
      </Tooltip>
      <HorizontalBar width={1.25} />
      <Observer>
        {() => {
          return lnbSpace.map(spaceInfo => (
            <SpaceItem
              key={spaceInfo.id}
              checked={spaceInfo.id === spaceStore.currentSpace.id}
              spaceName={spaceInfo.name}
              spaceUnreadCount={spaceInfo.totalUnreadRoomCount}
              spaceDomain={spaceInfo.domain}
            />
          ));
        }}
      </Observer>

      <Observer>
        {() => {
          if (dropdownSpace.length === 0) return null;

          const spaceMenu = (
            <Menu style={{ width: '12.375rem' }}>
              {dropdownSpace.map(spaceInfo => (
                <Menu.Item key={spaceInfo.id}>
                  <SpaceDropdownItem
                    key={spaceInfo.id}
                    checked={spaceInfo.id === spaceStore.currentSpace.id}
                    spaceName={spaceInfo.name}
                    spaceUnreadCount={spaceInfo.totalUnreadRoomCount}
                    spaceDomain={spaceInfo.domain}
                  />
                </Menu.Item>
              ))}
            </Menu>
          );
          return (
            <Dropdown
              trigger={['click']}
              overlay={spaceMenu}
              placement="topLeft"
            >
              <ItemWrapper background="#fff">
                <HorizontalViewMoreIcon
                  width={1.5}
                  height={1.5}
                  color="#232d3b"
                />
              </ItemWrapper>
            </Dropdown>
          );
        }}
      </Observer>

      <Tooltip
        title={t('CM_CREATE_CONTENTS_AREA_02')}
        placement="right"
        color="#4C535D"
      >
        <ItemWrapper background="#faf8f7" onClick={handleNewSpace}>
          <AddIcon width={1} height={1} color="#7b7671" />
        </ItemWrapper>
      </Tooltip>
    </Wrapper>
  );
};

export default React.memo(SpaceSide);