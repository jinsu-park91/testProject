import React, { useState } from 'react';
import styled from 'styled-components';
import { Row } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Input, Form, useCoreStores, Button } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import NewIdInput from './NewIDinput';
import NewPasswordInput from './NewPasswordInput';
import AuthMobileInput from './AuthMobileInput';
import NewEmailInput from './NewEmailInput';
import { checkNameValid, checkAuthNumber } from '../../libs/Regex';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const CommonContent = styled.div`
  height: auto;
  width: 40.26rem;
  border-style: solid;
  padding: 3.63rem 4.38rem;
  border-width: 0.06rem;
  border-radius: 0.94rem;
  box-shadow: 0rem 0rem 0.75rem 0.06rem rgba(125, 138, 148, 0.1);
  border-color: #e3e7eb;
  display: flex;
  flex-direction: column;
`;
const SignupFormContent = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const { authStore } = useCoreStores();
  const [nameValid, setNameValid] = useState('error');
  const [authNumber, setAuthNumber] = useState('');
  const [validAuthNumber, setValidAuthNumber] = useState('init');
  const [checkDuplicationId, setCheckDuplicationId] = useState('');

  const handleOncChangeName = e => {
    if (e.target.value.length) {
      const isValid = checkNameValid(e.target.value);
      isValid ? setNameValid('success') : setNameValid('error');
    } else {
      setNameValid('error');
    }
  };
  // 가입완료 누를시..
  const onFinish = async values => {
    // first view Validation
    if (checkDuplicationId !== 'RST0001') {
      return;
    }
    // 인증번호  검사.
    if (checkAuthNumber(authNumber)) {
      setValidAuthNumber('success');
      const res = await authStore.getAuthNumberPhone({
        authNumber,
        phone: values.phone,
      });
      if (typeof res !== 'undefined' && res) {
        // no nationalcode
        values.nationalCode = '+82';
        typeof values.email === 'undefined'
          ? (values.email = '')
          : values.email;
        const userType = 'USR0002';
        const agreeAd =
          JSON.parse(localStorage.getItem('RegisterCheckedList')).length === 4
            ? 'Y'
            : 'N';
        const registerObj = {
          userId: values.loginId,
          pw: values.password,
          name: values.name,
          phone: values.phone,
          ncode: values.nationalCode,
          type: userType,
          email: values.email,
          personal: 'Y',
          advertise: agreeAd,
          path: 'Csp',
        };
        const resRegi = await authStore.createUser({
          registerInfo: registerObj,
        });
        if (resRegi) {
          localStorage.setItem('CreateUser', values.loginId);
          history.push(`/registerComplete`);
        }
      } else {
        setValidAuthNumber('error');
      }
    } else {
      setValidAuthNumber('error');
    }
  };

  return (
    <CommonContent>
      <Form
        {...formItemLayout}
        form={form}
        initialValues={{
          loginId: '',
          name: '',
          phone: '',
          authNumber: '',
          email: '',
          password: '',
          passwordConfirm: '',
        }}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <NewIdInput
          checkDuplicationId={checkDuplicationId}
          setCheckDuplicationId={setCheckDuplicationId}
        />

        <NewPasswordInput />
        <div>이름</div>
        <Form.Item
          name="name"
          noStyle
          rules={[
            {
              required: true,
              message: '이름을 입력해 주세요.',
              whitespace: true,
            },
            {
              validator: (_, value) =>
                checkNameValid(value)
                  ? Promise.resolve()
                  : Promise.reject('특수 문자는 입력할 수 없습니다'),
            },
          ]}
        >
          <Input
            onChange={handleOncChangeName}
            placeholder="이름을 입력해 주세요."
            placement="topLeft"
          />
        </Form.Item>
        <Row>
          <CheckOutlined
            className="NewNameValid"
            style={
              nameValid === 'success'
                ? { color: '#16AC66' }
                : { color: '#75757F' }
            }
          />
          <div>특수기호 이외 모든 문자 입력 가능</div>
        </Row>
        <NewEmailInput />
        <AuthMobileInput
          setAuthNumber={setAuthNumber}
          validAuthNumber={validAuthNumber}
          setValidAuthNumber={setValidAuthNumber}
        />

        <Form.Item {...tailFormItemLayout}>
          <Button type="solid" htmlType="submit">
            가입 완료
          </Button>
        </Form.Item>
      </Form>
    </CommonContent>
  );
};

export default SignupFormContent;