import moment from 'moment';

export const handleFriendsDialogType = async (
  orgStore,
  myProfile,
  domainKey,
  orgFunction,
  noOrgFunction,
) => {
  const params = { orgType: 'ADM0021', publicType: 'ADM0011' }; // 공개 조직만 조회
  const response = await orgStore.getOrgTree(params);
  if (response && response.length) {
    orgFunction();
  } else {
    try {
      const useDomainKey =
        process.env.REACT_APP_ENV === 'local' ? domainKey : undefined;
      const res = await orgStore.getUserOrgUserList(
        myProfile?.companyCode,
        myProfile?.departmentCode,
        myProfile?.id,
        useDomainKey,
      );
      noOrgFunction(res);
    } catch (e) {
      console.log('getUserList Error');
    }
  }
};

export const handleCheckNewFriend = friendInfo => {
  const now = moment();
  const friendRegDate = moment(
    friendInfo.friendRegDate,
    'YYYY-MM-DD HH:mm:ss.S Z',
  );

  return friendRegDate.isValid() && now.diff(friendRegDate, 'minutes') < 60;
};

export default {
  handleFriendsDialogType,
  handleCheckNewFriend,
};
