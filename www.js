var express = require('express');
var app = express();
let crack_geetest = require('./');

var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
}
 async function testOnce(config) {
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
        return {"success":0,"result":String(error)}
    }
        
    if(!crack)return {"success":0,"result":""}
    
    var post_body = "geetest_challenge=" + crack.challenge 
    + "&geetest_validate=" +  crack.validate 
    + "&geetest_seccode=" + crack.validate+"|jordan";
    console.log(post_body)
    return {"success":1,"result":post_body}
}

app.get('/getval', async function (req, res) {
   //console.log(req)
   let params=req.query
   
   let r=await testOnce(params)
   let result=r["result"]
   let ret={"success":r["success"],"params":params,"result":result}
   res.end( JSON.stringify(ret));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
