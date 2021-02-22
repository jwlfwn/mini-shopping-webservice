module.exports = {
    server_port:3300,
    db_url:'mongodb://localhost:27017/shopping',
    db_schemas: [
        {file:'./order_schema', collection:'order1', schemaName:'ShoppingSchema', modelName:'ShoppingModel'},
        {file:'./user_schema', collection:'user1', schemaName:'UserSchema', modelName:'UserModel'}
    ],
    route_info: [
        {file:'./clinic', path:'/process/listclinic_seonbyeol', method:'listclinic_seonbyeol', type:'post'},
        {file:'./clinic', path:'/process/listclinic_kukmin', method:'listclinic_kukmin', type:'post'},
        {file:'./clinic', path:'/process/listclinic_geomsa', method:'listclinic_geomsa', type:'post'}
    ]
};