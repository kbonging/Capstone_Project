// src/utils/common.js

/**
 * 입력값이 주어진 정규식 패턴에 맞는지 확인합니다.
 * @param {string} input - 검사할 문자열
 * @param {string} pattern - 정규식 패턴 (문자열 형식)
 * @returns {boolean} 패턴과 일치하면 true, 그렇지 않으면 false
 */
export function validateInput(input, pattern) {
    const regex = new RegExp(pattern);
    return regex.test(input);
}

export const formatPhoneNumber = (num) => {
  if (num.length === 11) {
    return num.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (num.length === 10) {
    return num.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  // 길이가 맞지 않으면 그냥 원래 숫자 반환
  return num;
};