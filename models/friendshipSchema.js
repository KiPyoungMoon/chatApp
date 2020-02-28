const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    requestId:  {type: String, required: true},
    targetId:   {type: String, required: true},
    confirm:    {type: String}
})

friendshipSchema.statics.findFriendShipInfo = function(args) {
    return this.findOne( { requestId: args.requestId, targetId: args.targetId } );
};

module.exports = mongoose.model('Friendship', friendshipSchema);