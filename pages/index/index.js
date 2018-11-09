const util = require('../../utils/util');
const md5 = require('../../utils/MD5');
const app = getApp();
Page({
    data: {
        isLogin:true,
    },
    onLoad: function () {
        this.test()
    },
    bindGetUserInfo(){
        // 查看是否授权
        wx.getSetting({
            success: res=>{
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    let code,userInfo;
                    util.wxPromisify(wx.login)().then(res=>{
                        return res
                    }).then(res=>{
                    // 使用 code 换取 openid 和 session_key 等信息
                        code = res.code
                        return util.wxPromisify(wx.getUserInfo)()
                    }).then(res=>{
                        if (res) {
                            userInfo = res;
                            wx.request({
                                // 通过此 url ，获取 openid 与 unionid
                                url: 'https://api.weixin.qq.com/sns/jscode2session',
                                data: {
                                    // 小程序的appid
                                    'appid': 'wxbb148b8b36075530',
                                    // 小程序的secret
                                    'secret': 'dd757ae14b9b99a97f34cc4c37e36f5f',
                                    // wx.login()返回的登录凭证
                                    'js_code': code,
                                    // 固定值,不需要改变
                                    'grant_type': 'authorization_code'
                                },
                                success: res => {
                                    // 返回的 openid
                                    console.log(res.data.openid);
                                    // 返回的会话密钥
                                    console.log(res.data.session_key);
                                    // 注意：上面两个字段值必定会返回，unionid 则只会在满足一定条件下返回，不是必定会返回的值
                                    console.log(res.data.unionid);
                                }
                            });
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    })
                }
            }
        })
    },
    test(){
        const a =  md5.hex_md5('1346789123');//MD5加密
        console.log(a);
        // 获取设备信息
        wx.getSystemInfo({
            success (res) {
                console.log('手机型号'+res.model);
                console.log('手机品牌'+res.brand);
                console.log('微信版本号' + res.version);
                console.log('操作系统版本' + res.system);
                console.log('客户端平台' + res.platform);
                console.log('客户端基础库版本' + res.SDKVersion);
            }
        })


        const header = {

        }
        console.log(header);

        wx.request({
            url: 'http://123.56.8.153/dy-content/api/content/v2/pull', //仅为示例，并非真实的接口地址
            data: {

            },
            header: {
                "CP_CLIENT_NAME": "dy_web",  // 客户端包名, 通过此来确定密钥, IOS与Android应该不同包名
                "CP_CLIENT_VC": "1",   // 客户端版本号, 数字, 唯一
                "CP_CLIENT_VN": "1.0.0",    // 客户端版本名, 字符串
                "CP_DEVICE": "10086", // 客户端设备ID, Android用imei, IOS是fu
                "CP_DEVICE_TYPE": "IOS",  // 客户端设备类型, IOS anroid
                "CP_TOKEN": "",   // 用户token, 未登录就为空
                "CP_TIME": new Date().getTime(),  // 客户端当前时间戳, 毫秒, 防刷, 防重放
                "CP_VERSION": "2.0",        // 协议版本, 目前都是1.0
                'content-type': 'application/json', // 默认值
                'CP_SIGN':a
            },
            success (res) {
                console.log(res.data)
            },
            fail(err){
                console.log(err);
            }
        })
    }
})
