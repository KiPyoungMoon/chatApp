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
        console.log(`친구관계 업데이트`);
        const requester = await UserInfo.findById( {_id: args.requestId } );
        console.log(`requester: ${requester}`);
        requester.addFriend(args.targetId);

        console.log(`요청자 업데이트`);
        const target = await UserInfo.findById( {_id: args.targetId } );
        console.log(`target: ${target}`);
        target.addFriend(args.requestId);
        // const targetFriend = target.friend.push(args.requestId);
        // const updateTarget = await UserInfo.findByIdAndUpdate( {_id: args.requestId }, { $set: { friend: targetFriend } }, { new: true } );
        console.log(`타겟 업데이트`);
    } catch (error) {
        return error;
    }
}

module.exports = mongoose.model('Friendship', friendshipSchema);