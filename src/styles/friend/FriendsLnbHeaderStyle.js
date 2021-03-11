import styled from 'styled-components';
import { WaplSearch } from 'teespace-core';

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0.63rem 0.75rem;
  .anticon {
    color: #bdc6d3;
  }
  &:hover,
  &:focus {
    .anticon {
      color: #000;
    }
  }
  .ant-input {
    &::placeholder {
      color: #bcbcbc;
    }
  }
`;

export const FriendSearch = styled(WaplSearch)`
  &.friendSearch {
    display: flex;
    flex: 1 1 0%;
    margin-right: 0.63rem;
    height: 1.75rem;
    padding: 0;
    border-width: 0 0 0.06rem 0;
  }
`;

export const FriendAddButton = styled.div`
  display: flex;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  &:hover {
    background: #eae6e0;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  }
  & > img {
    width: 1.34rem;
    height: 1.34rem;
  }
`;