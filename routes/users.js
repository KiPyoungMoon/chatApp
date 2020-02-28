const express = require('express');
const router = express.Router();
const UserInfo = require('../models/userInfoSchema');

/* POST save UserInfo */
router.post('/', function(req, res, next) {

  const userInfo = new UserInfo({
    name:   req.query.name,
    email:  req.query.email,
    userId: req.query.userId
  });

  userInfo.save()
    .then(result => {return res.status(202).send(result)})
    .catch(err => {
      return res.status(500).send(err);
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  const searchInfo = {
    name: req.query.name,
    email: req.query.email
  }

  if (searchInfo.name == undefined && searchInfo.email == undefined) {
    return res.status(500).send( { err: '검색어가 필요합니다.' } );
  }
  if (searchInfo.email !== undefined && searchInfo.email !== "") {
    // 이메일로 검색
    console.log("유저 검색 요청: 메일");
    UserInfo.findOneByUserEmail(searchInfo.email)
      .then((userInfo) => {
        if (!userInfo) {
          return res.status(404).send( { err: 'UserInfo not found' } );
        }
        return res.send(userInfo);
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  } else if (searchInfo.name !== undefined && searchInfo.name !== "") {
    // 이름으로 검색
    console.log("유저 검색 요청: 이름");
    UserInfo.findAllByUserName(searchInfo.name)
      .then((userInfo) => {
        if (userInfo.length === 0) {
          return res.status(404).send( { err: 'UserInfo not found' } );
        }
        return res.send(userInfo);
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  }
});

module.exports = router;
