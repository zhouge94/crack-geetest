var express = require('express');
var app = express();
let crack_geetest = require('./');

//添加的新用户数据
var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
}
 async function testOnce(config) {
    // B站登录
    console.log(config)
    let crack={}
    try {
        let site = config["site"]
        let gt = config["gt"];
        let challenge = config["challenge"];
    
        crack = await crack_geetest(gt, challenge, site, { debug: false });
        console.log(crack);
    } catch (error) {
        console.log(String(error))
        return {"sucess":0,"result":String(error)}
    }
        
    if(!("geetest_challenge" in crack))return {"sucess":0,"result":""}
    
    var post_body = "geetest_challenge=" + crack.challenge 
    + "&geetest_validate=" +  crack.validate 
    + "&geetest_seccode=" + crack.validate+"|jordan";
    console.log(post_body)
    return {"sucess":1,"result":post_body}
}

app.post('/addUser', async function (req, res) {
   // 读取已存在的数据
   console.log(req)
   params=req.query
   
   r=await testOnce(params)
   result=r["result"]
   ret={"sucess":r["sucess"],"params":params,"result":result}
   res.end( JSON.stringify(ret));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})