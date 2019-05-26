import QueueService from './lib/queue_service'
import EmojiService from './lib/emoji_service'
import MessageService from './lib/message_service'
import SessionService from './lib/session_service'
import Config from './config'


class WebIM{
    constructor(EmojiConfig=Config) {
        this.Queue = new QueueService();
        this.Message = new MessageService();
        this.Emoji = new EmojiService(EmojiConfig);
        this.Session = new SessionService()
    }
    _groupBy(array, f) {
        let groups = {};
        array.forEach(function (o) {
            let group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return groups
    }
    _initMSG(msg) {
        var mid = msg.id;
        var value = JSON.parse(msg.content);
        var content = value.data;
        if (value.type == 'txt' || value.type == 'emoji' || value.type == 'gift') {
            content = this.Emoji.parseEmoji(value.data.replace(/\n/mg, ''))
        }
        var msgData = {
            to: msg.to_user_id,
            from: msg.from_user_id,
            type: value.type,
            data: content,
            duration: value.duration,
            time: msg.created_at,
            mid: mid > 0 ? '_' + mid : '_' + msg.created_at,
            id: mid
        }
        return msgData
    }

    async sendMessageToUsers(toUserIds, content) {
        return await this.Message.batchAdd(toUserIds, content)
    }
    async loadUnReadMsgs(current_chat_userid = 0) {
        let messages = await this.Message.newMsgs()
        messages = messages.map(this._initMSG, this)
        let returnData = []
        if (messages.length > 0) {
            let msgGroup = this._groupBy(messages, item => item.from)
            console.log(messages, msgGroup, Object.keys(msgGroup))
            Object.keys(msgGroup).forEach(to_user_id => {
                let msgs = msgGroup[to_user_id]
                let isRead = false
                if (current_chat_userid == to_user_id) {
                    returnData = msgs
                    isRead = true
                }
                this.Session.appendMsgs(to_user_id, msgs)
                this.Queue.join(to_user_id, msgs[msgs.length - 1], isRead)
            })
        }
        return returnData
    }
    async getHistroyMsgs(user_id, current_fromid = 0) {
        let messages = await this.Message.loadMsgs(user_id, this.Session.getSelfId(), current_fromid)
        messages = messages.map(this._initMSG, this)
        this.Session.prependMegs(user_id, messages)
        this.Queue.join(user_id, messages[messages.length - 1])
        return messages
    }
    loadMsgs(user_id) {
        return this.Session.getMsgs(user_id)
    }
    getLoginName(id) {
        return id
    }
    getIdByName(name) {
        return name.replace("xiaocheng", "")
    }
    getRoomName(msgData) {
        if (this.isGroupChatroom(msgData.info.to)) {
            return msgData.info.to
        }
        return msgData.info.from + '&' + msgData.info.to
    }
    getGroupName(groupid) {
        return "xiaochenggroup" + groupid
    }
    getGroupIdByName(name) {
        return name.replace("xiaochenggroup", "")
    }
    isGroupChatroom(name) {
        return name.indexOf("xiaocheng") < 0
    }

}

export default WebIM;