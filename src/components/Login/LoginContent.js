import React, { useState } from 'react';
import { Button, Checkbox, Form, useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import LoginPasswordInput from './LoginPasswordInput';
import LoginIdInput from './LoginIdInput';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const LoginForm = styled.div`
  margin-bottom: 0.375rem;
  .ant-form {
    font-size: 0.75rem;
    line-height: 1.88rem;
    label {
      vertical-align: middle;
      font-size: 0.75rem;
      &:hover {
        .ant-checkbox-inner {
          border-color: #6c56e5;
        }
      }
    }
  }
  .ant-form-item {
    font-size: 0.75rem;
    margin-bottom: 0.375rem;
    & + .ant-form-item {
      margin-bottom: 0.4375rem;
    }
  }
`;
const FlexBox = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.25rem;
  .ant-form-item {
    margin-bottom: 0;
    line-height: 1rem;
    & + .ant-form-item {
      margin-left: 1.125rem;
      &:first-of-type {
        margin-left: 0;
      }
    }
    .ant-checkbox {
      & + span {
        padding-right: 0;
      }
    }
    input[type='checkbox'] {
      width: 16px;
      height: 16px;
    }

    & + .ant-form-item {
      margin-bottom: 0;
    }
  }
  .ant-form-item-control-input {
    min-height: 1rem;
  }
`;

const LoginContent = () => {
  const { authStore } = useCoreStores();
  const [form] = Form.useForm();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [loginResult, setLoginResult] = useState(null);
  const [errorResult, setErrorResult] = useState(null);
  const [saveIdCheck, setSaveIdCheck] = useState(false);
  const [loginStateCheck, setLoginStateCheck] = useState(false);

  localStorage.removeItem('RegisterCheckedList');
  localStorage.removeItem('CreateUser');

  const onFinish = async values => {
    setIsLoading(true);
    try {
      const res = await authStore.login({
        id: values.username,
        pw: values.password,
        isLocalLogin: process.env.REACT_APP_ENV === 'local',
      });
      setLoginResult(res);

      history.push(`/f/${authStore.user.loginId}`);
    } catch (e) {
      setErrorResult(e.message);
      setIsLoading(false);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return useObserver(() => (
    <LoginForm>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          saveId: false,
          loginState: false,
        }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <LoginIdInput />
        <LoginPasswordInput />
        <FlexBox>
          <Form.Item
            {...tailLayout}
            name="saveId"
            valuePropName="checked"
            wrapperCol={{ span: 24 }}
          >
            <Checkbox shape="round">아이디저장</Checkbox>
          </Form.Item>
          <Form.Item
            {...tailLayout}
            name="loginState"
            valuePropName="checked"
            wrapperCol={{ span: 24 }}
          >
            <Checkbox shape="round">로그인 상태 유지</Checkbox>
          </Form.Item>
        </FlexBox>
        {isLoading === true && <span>로그인 중</span>}
        {isLoading === false && errorResult && (
          <span>로그인 실패! 사유: {errorResult}</span>
        )}
        {isLoading === false && loginResult && <span>로그인 성공</span>}
        <Form.Item {...tailLayout} noStyle>
          <Button type="solid" htmlType="submit">
            로그인
          </Button>
        </Form.Item>
      </Form>
    </LoginForm>
  ));
};

export default LoginContent;
