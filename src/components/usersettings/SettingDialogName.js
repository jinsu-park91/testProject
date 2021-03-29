import React from 'react';
import { Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import {
  InnerItem,
  Name,
  Data,
  TextArea,
  EditNameInput,
  ButtonArea,
} from '../../styles/SettingDialogStyle';

const SettingDialogName = props => {
  const { t } = useTranslation();
  const { name, isNameEdit, onInputChange, onCancel, onSuccess } = props;
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;

  return (
    <InnerItem>
      <Name>{t('CM_NAME')}</Name>
      <Data>
        <TextArea>
          {isNameEdit ? (
            <EditNameInput
              maxLength={20}
              placeholder={myProfile.name}
              value={name}
              onChange={input => {
                onInputChange(input);
              }}
            />
          ) : (
            <p>{myProfile.name || '-'}</p>
          )}
        </TextArea>
        <ButtonArea>
          {isNameEdit ? (
            <>
              <Button
                size="small"
                type="solid"
                className="color-Beige"
                disabled={myProfile.name === name}
                onClick={onSuccess}
              >
                {t('CM_SAVE')}
              </Button>
              <Button size="small" type="outlined" onClick={onCancel}>
                {t('CM_CANCEL')}
              </Button>
            </>
          ) : (
            <Button size="small" type="outlined" onClick={onCancel}>
              {t('CM_CHANGE')}
            </Button>
          )}
        </ButtonArea>
      </Data>
    </InnerItem>
  );
};

export default SettingDialogName;
