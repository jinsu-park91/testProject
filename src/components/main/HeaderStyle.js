import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  height: 3.188rem;
  align-items: center;
  border-bottom: 1px solid #dddddd;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.9375rem;
  min-width: 0;
  flex: auto;
  height: 100%;
  border-right: 1px solid #dddddd;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: auto;
  height: 100%;
`;

export const SystemIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const AppIconContainer = styled.div`
  display: flex;
  align-items: center;
  border-right: 1px solid #dddddd;
  height: 40px;
  padding: 0 0.9375rem;
`;

export const UserMenu = styled.div`
  padding: 0 0.625rem;
`;

export const UserCountText = styled.div`
  font-size: 0.875rem;
  margin-left: 0.5rem;
  opacity: 0.5;
  margin-right: 0.5rem;
`;

export const TitleText = styled.div`
  font-size: 0.875rem;
  margin-left: 0.5rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const IconWrapper = styled.div`
  display: flex;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  &:hover {
    background: #dcddff;
  }
`;