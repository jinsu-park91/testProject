import React, { useState } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { useCoreStores, Toast, Message, Button } from 'teespace-core';

import { useStore } from '../../stores';

function Settingsave(props) {
  const [canclevisible, setcanclevisible] = useState(false);
  const [savevisible, setsavevisible] = useState(false);
  const { authStore } = useCoreStores();
  const { form, onClick, selectedKey } = props;

  const saveOut = props => {
    if (selectedKey === '3') props.saveaccountOut();

    if (selectedKey === '6') props.savepasswordOut();
  };

  const saveChange = props => {
    if (selectedKey === '3') props.saveaccountChange();

    if (selectedKey === '6') props.savepasswordChange();
  };

  return (
    <>
      <Button
        type="solid"
        onClick={() => {
          setsavevisible(true);
          form.current.submit();
          saveChange(props);
        }}
      >
        변경사항 저장
      </Button>
      <Toast
        visible={savevisible}
        timeoutMs={3000}
        onClose={() => setsavevisible(false)}
      >
        {' '}
        변경사항이 저장되었습니다.{' '}
      </Toast>

      <Button
        onClick={() => {
          setcanclevisible(true);
        }}
        type="solid"
      >
        취소{' '}
      </Button>
      <Message
        visible={canclevisible}
        btns={[
          {
            onClick: () => {
              saveOut(props);
            },
            text: '나가기',
            type: 'solid',
          },
          {
            onClick: () => {
              setcanclevisible(false);
            },
            text: '취소',
            type: 'outlined',
          },
        ]}
        title="변경 사항을 저장하지 않고 나가시겠습니까?"
      />
    </>
  );
}

export default Settingsave;