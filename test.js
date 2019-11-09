
let should = require('should');
let crack_geetest = require('./');
let request = require('superagent');

async function testOnce() {
    // B站登录
    let site = 'https://040552.com/';
    let agent=request.agent()
    r=await agent.get(site)
    console.log(r.text)
    var pat=/<iframe id=\"main-iframe\" src=\"(.*?)\" frameborder/g
    referer=pat.exec(r.text)[1]
    console.log(referer)
    cookies=r.header["set-cookie"]
    let cookies_str=""
    for(i in cookies){
        cookies_str+=String(cookies[i]).split(";")[0]+";"
    }

    console.log(cookies,cookies_str)
    r=await agent.get(site+'/_Incapsula_Resource').query({SWCNGEEC:1})
    text=r.text
    let config = JSON.parse(text);
    should(config.gt).be.a.String().and.not.empty();
    should(config.challenge).be.a.String().and.not.empty();
    let gt = config.gt;
    let challenge = config.challenge;

    // B站注册
    // let config = JSON.parse((await request.get('https://passport.bilibili.com/web/captcha/combine').query({
    //     plat:6
    // })).text).data.result;
    // should(config.gt).be.a.String().and.not.empty();
    // should(config.challenge).be.a.String().and.not.empty();
    // let gt = config.gt;
    // let challenge = config.challenge;
    // let site = 'https://passport.bilibili.com/register/phone.html';

    let crack = await crack_geetest(gt, challenge, site, { debug: false });
    console.log(crack);

    if(!crack)return false

    var post_body = "geetest_challenge=" + crack.challenge 
    + "&geetest_validate=" +  crack.validate 
    + "&geetest_seccode=" + crack.validate+"|jordan";
    console.log(r.header["cookies"])

    r=await request.post(site+"/_Incapsula_Resource?SWCGHOEL=gee")
    .set("cookie",cookies_str)
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("accept-encoding", "gzip, deflate, br")
    .set("user-agent","Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36")
    .set("referer",referer)
    .send(post_body);
    console.log(r.text)
    console.log(r)
    console.log(post_body)

    console.log("begin to get site page")
    console.log(r.header)
    r=await agent.get(site)
    console.log(r.text)


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