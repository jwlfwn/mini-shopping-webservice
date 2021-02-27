var iamport = require('../config/iamport');

var getToken = async function() {
    var token = await axios({
    url: "https://api.iamport.kr/users/getToken",
    method: "post", // POST method
    headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    data: {
    imp_key: iamport.apikey, // REST API키
    imp_secret: iamport.apiSecret // REST API Secret
    }
    return token.data.response; // 인증 토큰
});

module.exports.getToken = getToken;