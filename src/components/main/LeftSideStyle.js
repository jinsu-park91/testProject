import styled from 'styled-components';
import { Tabs } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 16.19rem;
  border-right: 1px solid #dddddd;
`;

export const CustomTabs = styled(Tabs)`
  &.ant-tabs {
    width: 100%;
  }

  & .ant-tabs-nav {
    margin: 0;
  }

  & .ant-tabs-nav-list {
    flex: 1;
  }

  & .ant-tabs-tab {
    width: calc(100% / 3);
    justify-content: center;
    margin: 0;
    background: #0b1d41;
  }

  & .ant-tabs-tab:hover {
    background: #07142d;
  }

  & .ant-tabs-ink-bar {
    background: #ff486d;
    height: 3px !important;
  }
`;