import React, { useEffect, useState } from 'react';
import Upload from 'rc-upload';
import styled, { css } from 'styled-components';
import {
  ContainerOutlined,
  MobileOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  EditOutlined,
  CameraOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Input, Dropdown, Menu, Modal } from 'antd';
import { useCoreStores } from 'teespace-core';

const IS_LOCAL = true;

const Profile = ({
  userId = null,
  editMode = false,
  isVertical = false,
  onModeChange = null,
}) => {
  const { userStore } = useCoreStores();
  const [isEditMode, setEditMode] = useState(editMode);
  const [profile, setProfile] = useState(null);
  // 유저 정보들
  const [background, setBackground] = useState(null);
  const [thumb, setThumb] = useState(null);
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [isChange, setIsChange] = useState(false);

  const isMyId = () => userId === userStore.myProfile.id;

  const getBackPhoto = backPhoto => {
    return userStore.getUserBackPhoto({
      userId,
      size: 'medium',
      isLocal: IS_LOCAL,
      backPhoto: backPhoto || null,
    });
  };

  const getThumbPhoto = thumbPhoto => {
    return userStore.getUserProfilePhoto({
      userId,
      size: 'medium',
      isLocal: IS_LOCAL,
      thumbPhoto: thumbPhoto || null,
    });
  };

  useEffect(() => {
    setEditMode(false);
    (async () => {
      const userProfile = await userStore.getProfile({ userId });
      setProfile(userProfile);
      setPhone(userProfile?.companyNum);
      setMobile(userProfile?.phone);

      setThumb(`/${getThumbPhoto()}`);
      setBackground(`/${getBackPhoto()}`);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (onModeChange && typeof onModeChange === 'function')
      onModeChange(isEditMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  // const toBase64 = async blobImage =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blobImage);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = err => reject(err);
  //   });

  // const toBlob = async file => {
  //   const result = await fetch(file).then(r => r.blob());
  //   return result;
  // };

  const handleChangeMode = () => {
    setEditMode(true);
  };

  const handleMeetingClick = () => {
    console.log('1 : 1 미팅');
  };

  const handleChangeBackground = file => {
    setIsChange(true);
    setBackground(URL.createObjectURL(file));
  };

  const handleChangePhoto = file => {
    setIsChange(true);
    setThumb(URL.createObjectURL(file));
  };

  const handleChangeDefaultBackground = () => {
    setIsChange(true);
    setBackground(`/${getBackPhoto()}`);
  };

  const handleChangeDefaultPhoto = () => {
    setIsChange(true);
    setThumb(`/${getThumbPhoto()}`);
  };

  const handleConfirm = async () => {
    // const blobImages = await Promise.all([toBlob(background), toBlob(thumb)]);
    // const base64Images = await Promise.all(
    //   blobImages.map(blobImage => toBase64(blobImage)),
    // );

    setEditMode(false);
  };

  const handleCancel = () => {
    Modal.confirm({
      centered: true,
      content: '변경 사항을 저장하지 않고 나가시겠습니까?',
      onOk: () => {
        setIsChange(false);
        setEditMode(false);

        setMobile(profile?.phone);
        setPhone(profile?.companyNum);
        setBackground(`/${getBackPhoto()}`);
        setThumb(`/${getThumbPhoto()}`);
      },
    });
  };

  return (
    <Wrapper
      imageSrc={background}
      isVertical={isVertical}
      onLoad={() => {
        URL.revokeObjectURL(background);
      }}
    >
      <Sidebar isVertical={isVertical}>
        <StyledButton isVertical={isVertical}>
          <MessageOutlined style={{ fontSize: '30px' }} />
          <Text>{isMyId() ? `나와의 Talk` : `1:1 Talk`}</Text>
        </StyledButton>
        {isMyId() ? (
          <StyledButton onClick={handleChangeMode} isVertical={isVertical}>
            <EditOutlined style={{ fontSize: '30px' }} />
            <Text>프로필 편집</Text>
          </StyledButton>
        ) : (
          <StyledButton onClick={handleMeetingClick} isVertical={isVertical}>
            <VideoCameraOutlined style={{ fontSize: '30px' }} />
            <Text>1:1 Meeting</Text>
          </StyledButton>
        )}
      </Sidebar>
      <Content>
        {isEditMode && (
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item>
                  <StyledUpload
                    component="div"
                    accept={['image/*']}
                    multiple={false}
                    customRequest={({ file }) => handleChangeBackground(file)}
                  >
                    배경 변경
                  </StyledUpload>
                </Menu.Item>

                <Menu.Item onClick={handleChangeDefaultBackground}>
                  기본 이미지로 변경
                </Menu.Item>
              </Menu>
            }
          >
            <ImageChangeButton position="tl">
              <PictureOutlined />
            </ImageChangeButton>
          </Dropdown>
        )}
        <UserImageWrapper position="br">
          <UserImage
            src={thumb}
            onLoad={() => {
              URL.revokeObjectURL(thumb);
            }}
          />
          {isMyId() && isEditMode && (
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item>
                    <StyledUpload
                      component="div"
                      multiple={false}
                      accept={['image/*']}
                      customRequest={({ file }) => handleChangePhoto(file)}
                    >
                      프로필 사진 변경
                    </StyledUpload>
                  </Menu.Item>
                  <Menu.Item onClick={handleChangeDefaultPhoto}>
                    기본 이미지로 변경
                  </Menu.Item>
                </Menu>
              }
            >
              <ImageChangeButton position="br">
                <CameraOutlined />
              </ImageChangeButton>
            </Dropdown>
          )}
        </UserImageWrapper>
        <BigText style={{ marginTop: '20px' }}>{profile?.name}</BigText>
        <Text>{`(${profile?.loginId}@tmax.teepsace.net)`}</Text>
        <UserInfoList>
          <UserInfoItem>
            <ContainerOutlined style={{ marginRight: '20px' }} />
            {profile?.fullCompanyJob}
          </UserInfoItem>
          <UserInfoItem>
            <MobileOutlined style={{ marginRight: '20px' }} />
            {isEditMode ? (
              <Input
                onChange={e => {
                  setIsChange(true);
                  setMobile(e.target.value);
                }}
                value={mobile}
              />
            ) : (
              <Text>{mobile}</Text>
            )}
          </UserInfoItem>
          <UserInfoItem>
            <PhoneOutlined style={{ marginRight: '20px' }} />
            {isEditMode ? (
              <Input
                onChange={e => {
                  setIsChange(true);
                  setPhone(e.target.value);
                }}
                value={phone}
              />
            ) : (
              <Text>{phone}</Text>
            )}
          </UserInfoItem>
          <UserInfoItem>
            <MailOutlined style={{ marginRight: '20px' }} />
            {profile?.email}
          </UserInfoItem>
        </UserInfoList>
        <ButtonContainer>
          {isEditMode && (
            <>
              <Button
                style={{ marginRight: '20px' }}
                disabled={!isChange}
                onClick={handleConfirm}
              >
                저장
              </Button>
              <Button onClick={handleCancel}>취소</Button>
            </>
          )}
        </ButtonContainer>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${props => (props.isVertical ? 'column-reverse' : 'row')};
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('${props => props.imageSrc}');
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: ${props => (props.isVertical ? 'row' : 'column')};
  align-items: center;
  justify-content: center;
  width: ${props => (props.isVertical ? '100%' : '250px')};
  height: ${props => (props.isVertical ? '200px' : '100%')};
  background: rgba(0, 0, 0, 0.3);
`;

const StyledUpload = styled(Upload)`
  &:focus {
    outline: 0;
  }
`;

const Text = styled.span`
  display: flex;
  align-items: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const ImageChangeButton = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: black;
  border-radius: 50%;
  position: absolute;

  &:hover {
    background: rgba(90, 95, 255);
    cursor: pointer;
  }

  ${props => {
    switch (props.position) {
      case 'tl':
      default:
        return css`
          top: 10px;
          left: 10px;
        `;

      case 'tr':
        return css`
          top: 10px;
          right: 10px;
        `;
      case 'bl':
        return css`
          bottom: 10px;
          left: 10px;
        `;
      case 'br':
        return css`
          bottom: 10px;
          right: 10px;
        `;
    }
  }}
`;

const StyledButton = styled(Text)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: ${props => (props.isVertical ? '100px' : '200px')};
  margin-top: 20px;
  border-radius: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }
`;

const Content = styled.div`
  display: flex;
  position: relative;
  width: calc(100% - 250px);
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const UserImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 210px;
  height: 210px;
  background: white;
  border-radius: 50%;
`;
const UserImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const UserInfoList = styled.div`
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
  height: 30px;
`;
const BigText = styled(Text)`
  font-size: 30px;
`;

const ButtonContainer = styled.div`
  height: 50px;
  margin-top: 20px;
  display: flex;
`;

export default Profile;
