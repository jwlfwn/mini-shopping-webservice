var iamport = require('../config/iamport');
var axios = require('axios');

var getpayMentHistory = async function(imp_uid, access_token) {
    console.log("getpayMentHistory 함수 호출됨.");
    
    var getPaymentData = await axios({
          url:'https://api.iamport.kr/payments/'+imp_uid,
          method: "get", 
          headers: { "Authorization": access_token } 
    });
    
    return getPaymentData.data.response;;    
    
};

module.exports.getpayMentHistory = getpayMentHistory;