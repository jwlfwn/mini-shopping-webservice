module.exports = {
    server_port:3300,
    db_url:'mongodb://localhost:27017/shopping',
    db_schemas: [
        {file:'./order_schema', collection:'order6', schemaName:'ShoppingSchema', modelName:'ShoppingModel'},
        {file:'./user_schema', collection:'user5', schemaName:'UserSchema', modelName:'UserModel'}
    ],
    route_info: [
        {file:'./order', path:'/process/selectItem', method:'selectItem', type:'post'},
        {file:'./order', path:'/process/requestPay', method:'requestPay', type:'post'},
        {file:'./order', path:'/process/iamport-callback', method:'iamport_webhook', type:'post'}
    ]                           
};