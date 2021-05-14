import styled, { css } from 'styled-components';
import { Button, Avatar } from 'antd';
import convertSpaceIcon from '../../assets/convert_space.svg';
import moreSpaceIcon from '../../assets/view_more.svg';

export const UserImage = styled.span`
  display: inline-block;
  position: relative;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  background-color: #fff;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const UserName = styled.p`
  overflow: hidden;
  margin-top: 0.5rem;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.25rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const UserMail = styled.span`
  display: block;
  overflow: hidden;
  margin-top: 0.13rem;
  font-size: 0.69rem;
  opacity: 0.8;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const UserStatus = styled.span`
  margin-top: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  font-size: 0.63rem;
  color: #fff;
  opacity: 0.5;
`;
export const UserButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.875rem;
  font-size: 0.69rem;
  opacity: 0.8;
  .ant-btn.ant-btn-link {
    min-width: auto;
    height: auto;
    padding: 0 0.375rem;
    font-size: 0.75rem;
    line-height: 1.13rem;
    color: #f7f4ef !important;
    &:hover span {
      text-decoration: underline;
    }
  }
`;
export const UserBar = styled.span`
  display: inline-block;
  width: 1px;
  height: 0.81rem;
  margin: 0 0.375rem;
  opacity: 0.6;
  background: #fff;
`;
export const LogoutButton = styled(Button)`
  &.ant-btn {
    margin-top: 0.5rem;
    width: 100%;
    color: #f7f4ef;
    background-color: transparent;
    border-color: #f7f4ef;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: #ebe6df;
      color: #ebe6df;
    }
    &:active,
    &:focus {
      background-color: #ddd7cd;
      border-color: #ddd7cd;
      color: #fff;
    }
  }
`;
export const UserSpaceArea = styled.div`
  position: relative;
  padding: 0.625rem 0.5rem 1.06rem 0.875rem;
  background-color: #fbf9f7;
  border-radius: 0 0 0.25rem 0.25rem;
  ${props =>
    !props.isEdit &&
    css`
      &:before {
        content: '';
        position: absolute;
        top: -1rem;
        left: 0;
        right: 0;
        height: 1rem;
        background-color: #fbf9f7;
      }
    `};
`;
export const DataName = styled.p`
  margin-bottom: 0.5rem;
  font-size: 0.63rem;
  line-height: 0.94rem;
  color: #777;
`;
export const DataBox = styled.div`
  display: flex;
  align-items: center;
  .ant-btn {
    min-width: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 1rem 1rem;
    &:hover {
      background-color: #f2efec;
    }
    &:active,
    &:hover:active:focus {
      background-color: #f2efec;
    }
  }
  .btn-convert {
    position: relative;
    background-image: url('${convertSpaceIcon}');
  }
  .btn-more {
    margin-left: 0.125rem;
    background-image: url('${moreSpaceIcon}');
  }
`;
export const NewBadge = styled.div`
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #dc4547;
  top: -0.1rem;
  right: -0.1rem;
`;
export const Logo = styled(Avatar)`
  flex-shrink: 0;
  width: 2.625rem;
  height: 2.625rem;
  font-size: 1.125rem;
  line-height: 2.5rem;
  font-weight: 500;
  color: #49423a;
  border-radius: 0.25rem;
  background-color: #ebe6df;
`;
export const Info = styled.p`
  overflow: hidden;
  flex: 1;
  margin: 0 0.625rem;
  font-size: 0.6875rem;
  color: #777;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
export const Title = styled.strong`
  overflow: hidden;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000;
  line-height: 1.25rem;
  text-overflow: ellipsis;
`;
export const Blind = styled.span`
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
`;
export const UserSubArea = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0.56rem 1rem 1.69rem;
  color: #000;
  font-size: 0.81rem;
  font-weight: 500;
  & > img {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.63rem;
  }
  & + & {
    border-top: 1px solid #e3e7eb;
  }
`;
export const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 0.25rem;
  background-color: transparent;
  margin-left: auto;
  &:hover {
    background-color: #f2efec;
  }
  &:active,
  &:hover:active:focus {
    background-color: #f2efec;
  }
`;
export const ConvertDropdown = styled.div`
  position: absolute;
  left: -12.5rem;
  width: 12rem;
  top: 15.63rem;
  border: 1px solid #c6ced6;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  background-color: #fff;
  z-index: 1050;
`;
export const ConvertNow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3125rem 0.6875rem;
  margin-top: 0.44rem;
`;
export const LogoSmall = styled.div`
  position: relative;
  width: 2.63rem;
  height: 2.63rem;
  font-size: 0.96rem;
  line-height: 1.96rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.32rem;
  background-color: #ebe6df;
  color: #0a1e3a;
  margin-right: 0.375rem;
  ${props =>
    props.checked &&
    css`
      line-height: 1.625rem;
      border: 1px solid #0a1e3a;
    `}
`;
export const LogoNumber = styled.div`
  position: absolute;
  line-height: 1.4;
  top: 0.15rem;
  right: 0.15rem;
  background-color: rgb(220, 69, 71);
  color: rgb(255, 255, 255);
  font-size: 0.52rem;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.4rem;
  padding: 0 0.2rem;
`;
export const NowInfo = styled(Info)`
  margin: 0 0.375rem 0 0;
  font-size: 0.625rem;
  line-height: 0.9375rem;
`;
export const NowTitle = styled(Title)`
  font-size: 0.75rem;
  line-height: 1.125rem;
`;
export const ConvertList = styled.ul`
  overflow-y: auto;
  max-height: 11.25rem;
`;
export const ConvertItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.3125rem 0.6875rem;
  color: #000;
  cursor: pointer;
  .ant-avatar {
    margin-right: 0.375rem;
  }
  &:hover {
    background-color: #faf8f7;
  }
`;
export const ItemText = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => (props.addSpace ? '#666666' : '#000000')};
`;
export const ConvertBox = styled.div`
  padding: 0.31rem 0;
`;
export const ConvertAdd = styled.div`
  display: flex;
  padding: 0.3125rem 0.6875rem;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
`;
export const AddBox = styled.span`
  height: 2.63rem;
  width: 2.63rem;
  background-color: #faf8f7;
  border-radius: 0.32rem;
  margin-right: 0.375rem;
  font-size: 0.88rem;
  line-height: 1.75rem;
  color: #49423a;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const AddText = styled.span`
  font-size: 0.75rem;
  color: #666;
`;
export const ConvertMove = styled.div`
  padding: 0.63rem 1.13rem;
  border-top: 1px solid #eeedeb;
  font-size: 0.69rem;
  font-weight: 500;
  color: #00493d;
  cursor: pointer;
  svg {
    margin-right: 0.4rem;
    width: 1rem;
    height: 1rem;
    vertical-align: top;
  }
`;
export const UserSettingArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 0;
  border-top: 1px solid #eeedeb;
`;
export const SettingButton = styled(Button)`
  min-width: 4.375rem;
`;
export const SettingBar = styled.span`
  display: inline-block;
  width: 0.1875rem;
  height: 0.1875rem;
  margin: 0 0.375rem;
  background-color: #7b7671;
  border-radius: 50%;
`;