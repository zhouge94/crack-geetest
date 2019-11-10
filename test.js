
let should = require('should');
let crack_geetest = require('./');
let request = require('superagent');

async function testOnce() {
    // B站登录

    let site = 'https://040552.com/';
    /*    r=await request.get(site)
    var pat=/<iframe id=\"main-iframe\" src=\"(.*?)\" frameborder/g
    referer=pat.exec(r.text)[1]
    console.log(referer)
    let cookies_str=""
    for(i in r.header["set-cookie"]){
        cookies_str+=String(r.header["set-cookie"][i]).split(";")[0]+";"
    }
    console.log(cookies_str)
    r=await request.get(site+'/_Incapsula_Resource?SWCNGEEC=1').set("cookie",cookies_str)

    text=r.text
    console.log(text)
    let config = JSON.parse(text);
    should(config.gt).be.a.String().and.not.empty();
    should(config.challenge).be.a.String().and.not.empty();
    */
    config=
    {"challenge": "a9325b41aa4ee9b67c09a99f02c3fb23", "gt": "98443ddedafab16e689467f796c2c4d6", "new_captcha": true, "success": 1}
    let gt = config.gt;
    let challenge = config.challenge;
    console.log(config)

    let crack = await crack_geetest(gt, challenge, site, { debug: false });
    console.log(crack);

    if(!crack)return false

    var post_body = "geetest_challenge=" + crack.challenge 
    + "&geetest_validate=" +  crack.validate 
    + "&geetest_seccode=" + crack.validate+"|jordan";
    console.log(post_body)
/*
    r=await request.post(site+"/_Incapsula_Resource?SWCGHOEL=gee")
    .set("cookie",cookies_str)
    .set("Content-Type", "application/x-www-form-urlencoded")
    .send(post_body);

    console.log(cookies_str)
    console.log("begin to get site page")
    r=await request.get(site).set("cookie",cookies_str)
    console.log(r.text.length)
*/

    return crack != null;
}

async function test() {
    const T = 1;
    let accepted = 0;
    for(let i = 0; i < T; i ++) {
        if (await testOnce()) accepted ++;
    }
    console.log(accepted, T);
}

async function run() {
    try {
        await test();
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();