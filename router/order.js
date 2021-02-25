var iamport = require('../config/iamport');
//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();

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
    addOrder(database, merchant_uid, product_name, amount, buyer_email,     buyer_name, buyer_tel, function(err, result) {
        if(err) {
               console.log('에러 발생.');
               res.send({message:"error"});
           } 
            
        if(result) {
            res.send({message:"success"});
        } else {
            res.send({message:"error"});
        }
    })   
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

module.exports.selectItem = selectItem;
module.exports.requestPay = requestPay;