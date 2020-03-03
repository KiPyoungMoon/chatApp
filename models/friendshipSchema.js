const mongoose = require('mongoose');
const UserInfo = require('./userInfoSchema');

const friendshipSchema = new mongoose.Schema({
    requestId:  {type: String, required: true},
    targetId:   {type: String, required: true},
    confirm:    {type: String}
})

friendshipSchema.statics.findFriendShipInfo = function(args) {
    return this.findOne( { requestId: args.requestId, targetId: args.targetId } );
};

friendshipSchema.statics.allowFriendShip = async function(args) {
    try {
        const updateRelation = await this.findByIdAndUpdate({ _id: args._id }, args, { new: true });
        console.log(`친구추가 수락`);
        const requester = await UserInfo.findById( { _id: args.requestId } );
        requester.friend.push(args.targetId);
        const result1 = await UserInfo.findByIdAndUpdate( { _id: requester._id }, requester, { new: true } );

        const target = await UserInfo.findById( { _id: args.targetId } );
        target.friend.push(args.requestId);
        const result2 = await UserInfo.findByIdAndUpdate( { _id: target._id }, target, { new: true } );
        console.log(`친구추가 수락 완료`);
        return '친구추가 성공';
    } catch (error) {
        return error;
    }
}

friendshipSchema.statics.deleteFriendShip = async function(args) {
    try {
        const updateRelation = await this.findByIdAndUpdate({ _id: args._id }, args, { new: true });
        console.log(`친구삭제`);
        const requester = await UserInfo.findById( { _id: args.requestId } );
        requester.friend.pull(args.targetId);
        const result1 = await UserInfo.findByIdAndUpdate( { _id: requester._id }, requester, { new: true } );

        const target = await UserInfo.findById( { _id: args.targetId } );
        target.friend.pull(args.requestId);
        const result2 = await UserInfo.findByIdAndUpdate( { _id: target._id }, target, { new: true } );
        return '친구삭제 성공';
    } catch (error) {
        return error;
    }
}

module.exports = mongoose.model('Friendship', friendshipSchema);