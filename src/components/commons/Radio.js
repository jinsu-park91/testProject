import React from 'react';
import styled from 'styled-components';
import { Radio } from 'antd';

const StyledRadio = styled(Radio)`
  .ant-radio-inner {
    outline: 0;
    box-shadow: 0 !important;
    outline: 0 !important;
    border: 1px solid #c6ced6 !important;
    box-shadow: 0 !important;
  }

  .ant-radio-checked::after {
    border: 0 !important;
  }

  .ant-radio-input:focus + .ant-radio-inner {
    border: 1px solid #ddd7ff !important;
  }

  .ant-radio-checked:not(.ant-radio-disabled) .ant-radio-inner::after {
    background-color: #6c56e5;
  }
`;

function CommonRadio(props) {
  return <StyledRadio {...props} />;
}

export default CommonRadio;