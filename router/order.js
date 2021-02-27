var iamport = require('../config/iamport');
var axios = require('axios');

var selectItem = function(req, res) {
    console.log('/process/selectItem 라우팅 함수 호출됨.');
    
    // 선택한 품목 이미지 경로, 이름, 가격
    var paramImage = req.body.image || req.query.image;
    var paramName = req.body.cloth_name || req.query.cloth_name;
    var paramPrice = req.body.price || req.query.price;
    
    console.log('요청 검색어 : ' + paramImage + ' ' + paramName + ' ' + paramPrice);
    
    var context = {
        code:iamport.indentifyCode,
        image:paramImage,
        name:paramName,
        price:paramPrice
    };
    req.app.render('pay', context, function(err, html) {
        if(err) {
            console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);
            console.log('에러 발생.');

            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>뷰 렌더링 중 에러 발생</h1>');
            res.write('<br><p>' + err.stack + '<p>');
            res.end();
            return;
        }

        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.end(html);
    });  
};

var requestPay = function(req, res) {
    console.log('/process/requestPay 라우팅 함수 호출됨.');
    
    // 품목 수량, 상품 이름, 수량, 고객 이메일, 이름, 번호
    var merchant_uid = req.body.uid;
    var product_name = req.body.product_name;
    var amount = req.body.amount;
    var buyer_email = req.body.buyer_email;
    var buyer_name = req.body.buyer_name;
    var buyer_tel = req.body.buyer_tel;
    
    
    console.log('요청 검색어 : ' + merchant_uid + '-' + product_name + '-' + amount + '-' + buyer_email + '-' + buyer_name + '-' + buyer_tel);
    
    var database = req.app.get('database');
    addOrder(database, merchant_uid, product_name, amount, buyer_email, buyer_name, buyer_tel, function(err, result) {
        if(err) {
               console.log('에러 발생.');
               console.log(err);
               res.send({message:"error"});
           } 
            
        if(result) {
            res.send({message:"success"});
        }   
    });
};

var addOrder = function(db, merchant_uid, product_name, amount, buyer_email,     buyer_name, buyer_tel, callback) {
    console.log('addOrder 호출됨');
    
    var order = new db.ShoppingModel({"merchant_uid":merchant_uid,"name":product_name,"amount":amount,"buyer_email":buyer_email,"buyer_name":buyer_name,"buyer_tel":buyer_tel,"created_at":Date.now()});
    
    order.save(function(err) {
        if(err) {
            callback(err, null);
            return;
        }
        
        console.log('주문 데이터 추가함.');
        callback(null, order);
    });
    
}

var iamport_webhook = async function(req, res) {
    try {
        console.log('/process/iamport-callback 라우팅 함수 호출됨.');
    
        var merchant_uid = req.body.merchant_uid;
        var imp_uid = req.body.imp_uid;

        console.log('iamport_webhook 인자 : ' + merchant_uid + '-' + imp_uid);

        // 엑세스 토큰 가져오기
        //var token = require('./accessToken');
        var getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "POST", // POST method
            headers: { "Content-Type": "application/json" }, 
            data: {
                imp_key: iamport.apikey, // REST API키
                imp_secret: iamport.apiSecret// REST API Secret
            }
        });    

        var {access_token} = getToken.data.response; 

        console.log('access_token 인자 : ' + access_token);

        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
          url:'https://api.iamport.kr/payments/'+imp_uid,
          method: "get", 
          headers: { "Authorization": access_token } 
        });

        var paymentData = getPaymentData.data.response; // 조회한 결제 정보

        // DB에서 결제되어야 하는 금액 조회
        var database = req.app.get('database');
        var order = await database.ShoppingModel.findById(paymentData.merchant_uid);
        var amountToBePaid = order[0].amount; // 결제 되어야 하는 금액

        // 결제 검증하기
        var { amount, status } = paymentData;

        console.log('결제된 금액 : ' + amount + ', 결제 되었어야 하는 금액 : ' + order[0].amount);

        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            await database.ShoppingModel.update({'merchant_uid':merchant_uid}, {$set :{'status':status, 'imp_uid':imp_uid}}, function(err){
                if(err) {console.log(err);}
            });
            switch (status) {
            case "ready": // 가상계좌 발급
              // DB에 가상계좌 발급 정보 저장
              var { buyer_email, vbank_num, vbank_date, vbank_name } = paymentData;
              await database.UserModel.update({'email':buyer_email}, { $set: { vbank_num : vbank_num, vbank_date :vbank_date, vbank_name:vbank_name }}, 
                function(err){
                    if(err) {callback(err);}
                });
              // 가상계좌 발급 안내 문자메시지 발송
              console.log("가상계좌 : " + vbank_name + " " + vbank_num + "로 발급완료.");    
              res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
              break;
            case "paid": // 결제 완료
              res.send({ status: "success", message: "일반 결제 성공" });
              break;
          }
        } else { // 결제 금액 불일치. 위/변조 된 결제
          throw { status: "forgery", message: "위조된 결제시도" };
        }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }  
}

module.exports.selectItem = selectItem;
module.exports.requestPay = requestPay;
module.exports.iamport_webhook = iamport_webhook;