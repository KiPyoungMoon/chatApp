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
        .then(result => {
            /**
             * 친추 요청 앱푸싱을 위해 fcm에 targetId로 토큰을 읽어온 후, 푸싱 메시지를 날리고, request에 완료 응답을 해야 한다.
             */
            return res.status(202).send(result);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.put('/', async function(req, res, next) {
    // 친구 요청 수락
    /**
     * 1. 요청/응답자 ID로 요청 내역이 있는지 확인.
     * 2. 해당 내역의 상태코드를 'r'에서 'c'로 업데이트
     * 3. 각각의 친구란에 상대 추가.
     */
    const friendship = {
        requestId: req.query.requestId,
        targetId: req.query.targetId
    };

    const result = await Friendship.findFriendShipInfo(friendship);

    if (result === null) {
        return res.status(404).send( { err: result } );
    };

    if (result.confirm !== 'r') {
        return res.status(404).send( { err: result } );
    };

    result.confirm = 'c'; // 관계 코드 변경
    try {
        const updateResult = await Friendship.allowFriendShip(result);
        console.log(`updateResult: ${updateResult}`);
        /**
         * 친추 수락이 되었으므로 상대방에게 수락 알림 앱푸싱을 한다. (필요하다면 구현.)
         * 메시징 기능이 구현된다면 해당 기능으로 대체하는 것도 좋을 것이라 판단됨.
         */
        return res.status(200).send(updateResult);
    } catch (error) {
        return res.status(404).send( { err: error } );
    }
});

router.delete('/', async function(req, res, next) {
    // 친구 삭제 
    /**
     * 1. 요청자와 상대의 ID를 받아 양측의 친구를 삭제.
     * 2. 친구요청 스키마에서 'c'를 'd'로 업데이트.
     */
    const friendship = {
        requestId: req.query.requestId,
        targetId: req.query.targetId
    };

    const result = await Friendship.findFriendShipInfo(friendship); 

    if (result === null) {
        return res.status(404).send( { err: result } );
    };

    if (result.confirm !== 'c') {
        return res.status(404).send( { err: result } );
    };

    result.confirm = 'd'; // 관계 코드 변경
    try {
        const updateResult = await Friendship.deleteFriendShip(result);
        console.log(`updateResult: ${updateResult}`);
        return res.status(200).send(updateResult);
    } catch (error) {
        return res.status(404).send( { err: error } );
    }
});

module.exports = router;