class SessionService {
    constructor() {
    }

    getStorageData(key, dataDefault = []) {
        try {
            var value = wx.getStorageSync(key)
            if (value) {
                return value
            }
            wx.setStorageSync(key, dataDefault)
            return dataDefault
        } catch (e) {
            console.log("获取 chatlist error");
        }
    }
    setStorageData(key, value) {
        try {
            wx.setStorageSync(key, value)
        } catch (e) {
            console.log("设置 chatlist error");
        }
    }

    getChatlist() {
        return this.getStorageData('chatqueue' + this.getSelfId(), [])
    }
    setChatlist(chatlist) {
        this.setStorageData('chatqueue' + this.getSelfId(), chatlist)
    }

    getId2Chatroom() {
        return this.getStorageData('id2chat' + this.getSelfId(), {})
    }
    setId2Chatroom(id2chatroom) {
        this.setStorageData('id2chat' + this.getSelfId(), id2chatroom)
    }

    getSelfId(){
        return wx.getStorageSync('uid')
    }

    getRoomName(to_userid) {
        if (typeof (to_userid) === Number && this.isGroupChatroom(to_userid)) {
            return to_userid
        }
        return 'xc' + this.getSelfId() + '&' + to_userid
    }
    getGroupName(groupid) {
        return "xcgroup" + groupid
    }
    getGroupIdByName(name) {
        return name.replace("xcgroup", "")
    }
    isGroupChatroom(name) {
        return name.indexOf("xiaocheng") < 0
    }

    appendMsgs(to_userid, msgs){
        let chatMsg = wx.getStorageSync(this.getRoomName(to_userid)) || []
        chatMsg.push.apply(chatMsg, msgs)
        wx.setStorage({
            key: this.getRoomName(to_userid),
            data: chatMsg,
            success: function () {
                console.log('success')
            }
        })
    }
    prependMegs(to_userid, msgs) {
        msgs = msgs.reverse()
        let chatMsg = wx.getStorageSync(this.getRoomName(to_userid)) || []
        msgs.push.apply(msgs, chatMsg)
        wx.setStorage({
            key: this.getRoomName(to_userid),
            data: msgs,
            success: function () {
                console.log('success')
            }
        })

    }
    getMsgs(to_user_id) {
        return wx.getStorageSync(this.getRoomName(to_user_id)) || []
    }
    getUsers(){
        return wx.getStorageSync("cachedUserInfo") || {}
    }
    updateUsers(infos) {
        let userinfos = wx.getStorageSync("cachedUserInfo") || {}
        let userids = wx.getStorageSync("cachedUserInfoList") || []
        Object.keys(infos).forEach(key => {
            key = parseInt(key)
            userinfos[key] = infos[key]
            userids.push(key)
        })
        wx.setStorage({
            key: "cachedUserInfo",
            data: userinfos,
            success: function () {
                console.log('success')
            }
        })
        this.setStorageData("cachedUserInfoList", userids)
    }
    getUserIdList() {
        return wx.getStorageSync("cachedUserInfoList") || []
    }
}

export default SessionService;