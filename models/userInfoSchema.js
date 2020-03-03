const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
    name:   { type: String, required: true },
    email:  { type: String, required: true },
    userId: { type: String, required: true },
    friend:  [ new mongoose.Schema( { friendId: String } ) ]
})

userInfoSchema.statics.findOneByUserEmail = function(email) {
    return this.findOne( { email } );
};

userInfoSchema.statics.findAllByUserName = function(name) {
    return this.find( { name: name } );
}

userInfoSchema.statics.createUserInfo = function(userInfo) {
    const userInfo = new this(userInfo);
    return userInfo.save();
}

module.exports = mongoose.model('UserInfo', userInfoSchema);