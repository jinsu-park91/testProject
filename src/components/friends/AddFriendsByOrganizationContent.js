import React, { useCallback } from 'react';
import styled from 'styled-components';
import { List } from 'react-virtualized';
import { Row, Col, Typography } from 'antd';
import FriendItem from './FriendItem';

const { Text } = Typography;

const Wrapper = styled.div`
  margin: 0 0.75rem 0.25rem 0.75rem;
`;

const Centered = styled(Col)`
  text-align: center;
`;

function AddFriendsByOrganizationContent({ orgUserList = [] }) {
  const rowRender = useCallback(
    ({ index, key, style }) => (
      <FriendItem
        style={style}
        friendInfo={orgUserList[index]}
        key={key}
        mode="addFriend"
      />
    ),
    [orgUserList],
  );
  return (
    <Wrapper>
      <Row align="middle" style={{ flexGrow: 1 }} justify="center">
        <Col span={24}>
          <List
            overscanRowCount={10}
            style={{ outline: 'none' }}
            rowCount={orgUserList.length}
            height={orgUserList.length === 0 ? 0 : 324}
            width={636}
            rowHeight={54}
            rowRenderer={rowRender}
            scrollToIndex={0}
          />
        </Col>
        <Centered>
          {orgUserList.length === 0 && (
            <Text type="secondary">조직원이 없습니다.</Text>
          )}
        </Centered>
      </Row>
    </Wrapper>
  );
}

export default React.memo(AddFriendsByOrganizationContent);
