import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { getRoomName } from '../MobileUtil';
import {
  Header,
  HeaderText,
  ButtonBox,
  IconButton,
} from '../style/MobileHeaderStyle';
import { ArrowBackIcon } from '../Icon';

const MobileTalkHeader = () => {
  const history = useHistory();
  const handleGoBack = () => history.push(`/room`);

  return (
    <Header>
      <ButtonBox onClick={handleGoBack}>
        <IconButton type="ghost" icon={<ArrowBackIcon />} />
      </ButtonBox>
      <Title>{getRoomName()}</Title>
    </Header>
  );
};

export default MobileTalkHeader;

const Title = styled(HeaderText)`
  color: #205855;
  width: calc(100% - 5rem);
`;
