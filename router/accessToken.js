var iamport = require('../config/iamport');
var axios = require('axios');

var getToken = async function() {
    console.log("getToken 함수 호출됨.");
    
    var getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "POST", // POST method
            headers: { "Content-Type": "application/json" }, 
            data: {
                imp_key: iamport.apikey, // REST API키
                imp_secret: iamport.apiSecret// REST API Secret
            }
    });
    
    console.log(getToken.data.response.access_token);
    return getToken.data.response.access_token;    
    
};

module.exports.getToken = getToken;