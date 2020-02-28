const express = require('express');
const router = express.Router();
const Friendship = require('../models/friendshipSchema');

router.post('/', async function(req, res, next) {
    // 친구 추가 요청
    /**
     * request: user _id, target _id 
     * 1. 중복 검색 (수락, 진행, 거부 무관함)
     * 2. 요청 update
     */
    const friendship = {
        requestId: req.query.requestId,
        targetId: req.query.targetId
    }

    const result = await Friendship.findFriendShipInfo(friendship);
    
    if (result !== null) {
        return res.status(404).send( { err: result } );
    };

    const createFriendship = new Friendship({
        requestId:  req.query.requestId,
        targetId:   req.query.targetId,
        confirm:    'r'
    });

    createFriendship.save()
        .then(result => {return res.status(202).send(result)})
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.put('/', function(req, res, next) {
    // 친구 요청 수락
});

router.delete('/', function(req, res, next) {
    // 친구 삭제 
});

module.exports = router;