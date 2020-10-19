const patternNum = /[0-9]/;
const patternEngs = /[a-z]/;
const patternEngb = /[A-Z]/;
const patternSpc = /[`'";~!@#$%^&*()_+|<>?:{}.\\/\\,\\=\\-]/;
const patternKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
//loginId pattern
const patternId = /[^-_0-9a-z]/;

//loginId length
export const checkLoginIdLength = length => {
  return length >= 5 && length <= 20;
};

//loginId validation
export const checkLoginIdValid = value => {
  return !patternId.test(value);
};

//password length
export const checkPasswordLength = length => {
  return length >= 9 && length <= 20;
};

//password validation
export const checkPasswordValid = value => {
  let countValid = 0;
  if (patternNum.test(value)) countValid += 1;
  if (patternEngs.test(value)) countValid += 1;
  if (patternEngb.test(value)) countValid += 1;
  if (patternSpc.test(value)) countValid += 1;
  if (patternKor.test(value)) countValid = 0;

  return countValid >= 3 ? true : false;
};

//name validation
export const checkNameValid = value => {
    return !patternSpc.test(value);
}


//phone validation
export const checkPhoneValid = value => {
   return !(
     value.length <= 3 ||
     patternEngs.test(value) ||
     patternEngb.test(value) ||
     patternSpc.test(value) ||
     patternKor.test(value)
   );
}

export const checkAuthNumber = value => {
  return !(
    value.length !== 6 ||
    patternEngs.test(value) ||
    patternEngb.test(value) ||
    patternSpc.test(value) ||
    patternKor.test(value)
  );
}

export default {
  checkLoginIdLength,
  checkLoginIdValid,
  checkPasswordLength,
  checkPasswordValid,
  checkNameValid,
  checkPhoneValid,
  checkAuthNumber,
};