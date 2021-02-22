


var Schema = {};

Schema.createSchema = function(mongoose) {
    console.log('createSchema 호출됨.');
    
    mongoose.set('useCreateIndex', true);
    var ShoppingSchema = mongoose.Schema({
        merchant_uid: {type:String, required:true, unique:true, 'default':''},
        name: {type:String, unique:false, default:''},
        amount: {type:String, unique:false, 'default':''},
        status :{type:String, unique:false, 'default':''},
        buyer_email :{type:String, unique:false, 'default':''},
        buyer_name :{type:String, unique:false, 'default':''},
        buyer_tel :{type:String, unique:false, 'default':''},
        created_at: {type:Date, index:{unique:false},'default':Date.now()},
        updated_at: {type:Date, index:{unique:false},'default':Date.now()}
    });
    console.log('ShoppingSchema 정의함.');

    // mongoose에서 직접 메서드 추가 method이용

    // mongoose에서 직접 메서드 추가 static이용
    UserSchema.static('findById', function(id, callback) {
        return this.find({id:id}, callback);
    });

    UserSchema.static('findAll', function(callback) {
        return this.find({}, callback);
    });
    
    return ShoppingSchema;
}

module.exports = Schema;