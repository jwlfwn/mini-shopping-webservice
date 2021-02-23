var iamport = require('../config/iamport');

var requestPay = function requestPay(req, res) {
    console.log('/process/requestPay 라우팅 함수 호출됨.');
    
    var IMP = window.IMP; 
    IMP.init(iamport.indentifyCode);
    IMP.request_pay({ // param
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: "ORD20180131-0000011",
      name: "노르웨이 회전 의자",
      amount: 64900,
      buyer_email: "gildong@gmail.com",
      buyer_name: "홍길동",
      buyer_tel: "010-4242-4242",
      buyer_addr: "서울특별시 강남구 신사동",
      buyer_postcode: "01181"
  }, function (rsp) { // callback
      if (rsp.success) {
          // 결제 성공 시 로직,
          console.log('테스트 성공~~');
      } else {
          // 결제 실패 시 로직,
      }
  });
}

module.exports.requestPay = requestPay;
  