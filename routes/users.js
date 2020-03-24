const express = require('express');
const router = express.Router();
const UserInfo = require('../models/userInfoSchema');

/* POST save UserInfo */
router.post('/', async function(req, res, next) {
  /**
   * post로 들어온 요청은 회원 정보를 처음 생성.
   * 1. 기 가입된 회원정보를 가져올 것으로 예상 해 중복체크 등은 제외함.
   * 2. 회원가입이 되면 아래의 정보들은 서버에서 날려주는 것으로 구현해야 할듯.
   * 3. 추가 정보가 필요하다면 userInfo schema를 수정해야 한다.
   */
  const userInfo = new UserInfo({
    name:       req.query.name,
    email:      req.query.email,
    userId:     req.query.userId,
    pushToken:  req.query.pushToken
  });
    /**
   * req.query.token: android, ios에서 앱푸싱 구현을 위해 토큰 정보를 같이 넘겨줘야 한다.
   */

  // userInfo.save()
  //   .then(result => {return res.status(202).send(result)})
  //   .catch(err => {
  //     return res.status(500).send(err);
  //   });
  /**
   * 사용자 정보 저장 시 중복 제거를 위해 save()대신 findOneAndUpdate()를 사용, { upsert: true } 옵션으로 검색 조건이 없을 경우 데이터를 생성하도록 함.
   * findOneAndUpdate( { filter(document) }, { update(document or array) }, { 옵션 }, callback )
   */
  try {
    await UserInfo.findOneAndUpdate( { userId: req.query.userId }, userInfo, { upsert: true } );
    return res.status(202).send( { msg: "userInfo create success." } );
  } catch (err) {
    return res.status(500).send(err);
  }
  // UserInfo.findOneAndUpdate( { userId: req.query.userId }, userInfo, { upsert: true } )
  //   .then( result => { 
  //     console.log(`result: ${result}`);
  //     return res.status(202).send(result);
  //   } )
  //   .catch(err => {
  //     console.log(`err: ${err}`);
  //     return res.status(500).send(err);
  //   });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  const searchInfo = {
    name:   req.query.name,
    email:  req.query.email,
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
