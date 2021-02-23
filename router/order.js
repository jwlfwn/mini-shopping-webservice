var selectItem = function(req, res) {
    console.log('/process/selectItem 라우팅 함수 호출됨.');
    
    // 선택한 품목 이미지 경로, 이름, 가격
    var paramImage = req.body.image || req.query.image;
    var paramName = req.body.cloth_name || req.query.cloth_name;
    var paramPrice = req.body.price || req.query.price;
    
    console.log('요청 검색어 : ' + paramImage + ' ' + paramName + ' ' + paramPrice);
    /*
    var database = req.app.get('database');
    if(database) {           
        database.ClinicModel.findByKeyword(paramKeyword, '99',
        function(err, results) {
            if(err) {
               console.log('에러 발생.');
               res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
               res.write('<h1>에러 발생</h1>');
               res.end();
               return;
           } 
            
            if(results) {
                var context = {
                    results:results
                };
                req.app.render('index', context, function(err, html) {
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
                
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>검색 실패.</h1>');
                res.end();
            }
        })
    } else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end();
    }*/
};

module.exports.selectItem = selectItem;