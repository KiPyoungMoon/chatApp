const mongoose = require('mongoose');
/**
 * 회원정보 스키마
 * 1. 이름
 * 2. 이메일
 * 3. 유저 아이디
 * 4. 안드로이드 기기 특정을 위한 토큰 정보를 기기로부터 받아 저장해야 한다.
 * 5. 친구목록
 * 
 * 이후 추가 사항은 스키마를 수정해야함. 
 * 안드로이드 및 본 서버와 연동하며 회원정보의 추가사항 수정 필요함.
 * 
 */
const userInfoSchema = new mongoose.Schema({
    name:   { type: String, required: true },
    email:  { type: String, required: true },
    userId: { type: String, required: true },
    pushToken:  { type: String, required: true },
    friend:  [ new mongoose.Schema( { friendId: String } ) ]
})

/**
 * 이메일로 회원정보 검색.
 */
userInfoSchema.statics.findOneByUserEmail = function(email) {
    return this.findOne( { email } );
};

/**
 * 이름으로 회원정보 검색.
 */
userInfoSchema.statics.findAllByUserName = function(name) {
    return this.find( { name: name } );
}

// userInfoSchema.statics.createUserInfo = function(userInfo) {
//     console.log(`userInfo: ${userInfo}`);
//     const userInfo = new this(userInfo);
//     return userInfo.save();
// }

module.exports = mongoose.model('UserInfo', userInfoSchema);