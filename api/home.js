import ajax from './ajax.js'

export default {
    // 登录
    login(param) {
        return ajax.post('/mobile/user/login', param)
    },
}