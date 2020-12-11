import React, { useState, useEffect, useCallback } from 'react';
import { UserSelectDialog } from 'teespace-core';
import { Checkbox } from 'antd';
import {
  FlexModal,
  Input,
  Description,
  Title,
  LengthCounter,
  Wrapper,
  ButtonContainer,
  StyledButton,
  ConfigWrapper,
} from './CreatePublicRoomDialogStyle';

const CreatePublicRoomDialog = ({ visible, onOk, onCancel }) => {
  const initialStates = {
    step: 0,
    roomName: '',
    selectedUsers: [],
    isStartMeeting: false,
  };

  const [step, setStep] = useState(initialStates.step);
  const [roomName, setRoomName] = useState(initialStates.roomName);
  const [isStartMeeting, setIsStartMeeting] = useState(
    initialStates.isStartMeeting,
  );
  const [selectedUsers, setSelectedUsers] = useState(
    initialStates.selectedUsers,
  );

  const clearState = () => {
    setStep(initialStates.step);
    setRoomName(initialStates.roomName);
    setSelectedUsers(initialStates.selectedUsers);
    setIsStartMeeting(initialStates.isStartMeeting);
  };

  useEffect(() => {
    if (!visible) {
      clearState();
    }
  }, [visible]);

  const handleChangeName = e => {
    const name = e.target.value;
    if (name.length < 51) setRoomName(name);
  };

  const handleOk = () => {
    const lastStep = 1;
    if (step === lastStep)
      onOk({
        selectedUsers,
        roomName,
        isStartMeeting,
      });
    else setStep(step + 1);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSelectedUserChange = useCallback(users => {
    setSelectedUsers(users);
  }, []);

  const handleStartMeetingChange = e => {
    setIsStartMeeting(e.target.checked);
  };

  const handleToggle = () => {
    setIsStartMeeting(!isStartMeeting);
  };
  return step === 0 ? (
    <FlexModal
      title={
        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
          오픈 룸 만들기
        </div>
      }
      visible={visible}
      closable={false}
      footer={null}
    >
      <Wrapper>
        <Title>룸 이름 설정하기</Title>

        <Input>
          <input
            type="text"
            value={roomName}
            onChange={handleChangeName}
            placeholder="목적, 토픽 등이 있다면 입력해 주세요."
          />
          <LengthCounter>{`${roomName.length}/50`}</LengthCounter>
        </Input>

        <Description>
          누구나 검색을 통하여 자유롭게 참여할 수 있는 공간입니다.
        </Description>

        <ButtonContainer>
          <StyledButton
            buttonType="ok"
            onClick={handleOk}
            disabled={!roomName.length}
          >
            생성
          </StyledButton>
          <StyledButton buttonType="cancel" onClick={handleCancel}>
            취소
          </StyledButton>
        </ButtonContainer>
      </Wrapper>
    </FlexModal>
  ) : (
    <UserSelectDialog
      visible={visible}
      title={
        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
          룸 구성원 초대
        </div>
      }
      onSelectedUserChange={handleSelectedUserChange}
      bottom={
        <>
          <ConfigWrapper>
            <Checkbox
              className="check-round"
              checked={isStartMeeting}
              onChange={handleStartMeetingChange}
            />
            <Title onClick={handleToggle} style={{ marginLeft: '0.38rem' }}>
              초대 구성원과 바로 Meeting 시작하기
            </Title>
          </ConfigWrapper>
          <ButtonContainer>
            {selectedUsers.length ? (
              <>
                <StyledButton
                  buttonType="ok"
                  onClick={handleOk}
                  disabled={!selectedUsers.length}
                >
                  확인
                </StyledButton>
                <StyledButton buttonType="cancel" onClick={handleCancel}>
                  취소
                </StyledButton>
              </>
            ) : (
              <StyledButton buttonType="ok" onClick={handleOk}>
                건너뛰기
              </StyledButton>
            )}
          </ButtonContainer>
        </>
      }
    />
  );
};

export default CreatePublicRoomDialog;