/*
 * http 코드 예외처리 클래스
 * @param {object || number} httpCode
 * @param {string} errorCode
 * @param {string} errorMessage
 * @param {object} data
 * [httpCode 가 타입이 2개인 이유]
 * 1. number
 * 숫자일 경우 httpCodeException을 그대로 전달한다.
 * 2. object
 * try 에서 400번으로 오류를 예외처리하고 catch에서 500번으로 예외처리를 하면 결과는 항상 500번 예외처리가 된다.
 * 이 문제를 해결하기 위해 catch에서 error 를 포함한 객체를 보내주면 httpCode에 객체가 들어오게 된다.
 * httpCode에 있는 error의 httpCode가 있을 경우는 try 안에서 이 메소드를 활용한 것이고 없을 경우는 500대 에러이다.
 */
class HttpCodeException extends Error {
  constructor(httpCode = 400, errorCode = '', errorMessage = '', data = {}) {
    super();
    const isFirstParamObject = typeof httpCode === 'object';
    if (isFirstParamObject) {
      const { error } = httpCode;
      const isInternalServerError = !error.httpCode;
      if (isInternalServerError) {
        this.httpCode = 500;
        this.errorCode = 'E500';
        this.errorMessage = httpCode.errorMessage || httpCode.error.message;
      } else {
        this.httpCode = error.httpCode;
        this.errorCode = error.errorCode;
        this.errorMessage = error.errorMessage;
        this.data = error.data;
      }
    } else {
      this.httpCode = httpCode;
      this.errorCode = errorCode;
      this.errorMessage = errorMessage;
      this.data = data;
    }
  }
}
module.exports = HttpCodeException;
