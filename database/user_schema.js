


var Schema = {};

Schema.createSchema = function(mongoose) {
    console.log('createSchema 호출됨.');
    
    mongoose.set('useCreateIndex', true);
    var UserSchema = mongoose.Schema({
        id: {type:String, required:true, unique:true, 'default':''},
        name: {type:String, index:'hashed', 'default':''},
        vbank_num: {type:String, unique:false, 'default':''},
        vbank_date:{type:Date, index:{unique:false},'default':''},
        created_at: {type:Date, index:{unique:false},'default':Date.now()},
        updated_at: {type:Date, index:{unique:false},'default':Date.now()}
    });
    console.log('UserSchema 정의함.');

    // mongoose에서 직접 메서드 추가 method이용

    // mongoose에서 직접 메서드 추가 static이용
    UserSchema.static('findById', function(id, callback) {
        return this.find({id:id}, callback);
    });

    UserSchema.static('findAll', function(callback) {
        return this.find({}, callback);
    });
    
    return UserSchema;
}

module.exports = Schema;