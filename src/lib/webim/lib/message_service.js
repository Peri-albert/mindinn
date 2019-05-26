import Resource from '../../resource'

class MessageService {
    constructor() {
    }
    async add(type, to_user_id, contentstr, duration=0) {
        let content = {
            "type": type,
            "data": contentstr,
            "duration": duration
        }
        let resource = "message.message";
        content = JSON.stringify(content)
        let data = await Resource.put({
            service: 'orion',
            resource: resource,
            data: {
                content,
                to_user_id,
                type
            }
        })
        return data
    }

    async batchAdd(ids, content) {
        let resource = "message.messages";
        let sendJSON = {
            "type": "txt",
            "data": content
        }

        try {
            let data = await Resource.put({
                service: 'orion',
                resource: resource,
                data: {
                    content: JSON.stringify(sendJSON),
                    to_user_ids: JSON.stringify(ids),
                    type: "txt"
                }
            })
            return true;
        } catch (e) {
            console.error(e)
            return true;
        }
    }
    async newMsgs() {
        let data = await Resource.get({
            service: 'orion',
            resource: 'message.unread_messages',
            data: {}
        })
        let messages = data.messages;
        return messages
    }
    async loadMsgs(to_user_id, self_id, current_fromid = 0) {
        let session = self_id + '-' + to_user_id
        if (to_user_id < self_id) {
            session = to_user_id + '-' + self_id
        }
        let data = await Resource.get({
            service: 'orion',
            resource: 'message.messages',
            data: {
                session: session,
                _p_from: current_fromid,
                _p_count: 50
            }
        })
        let messages = data.messages;
        return messages
    }
    async sendGroupMsg(content, group_id) {

        let resource = "message.message";
        let data = await Resource.put({
            service: 'orion',
            resource: resource,
            data: {
                content: JSON.stringify(content),
                group_id: group_id,
                type: content.type
            }
        })
        let msgData = this.initMSG(content, true, data.id)
        return msgData

    }
    async loadUnReadGroupMsgs(selfid, group_id, from_id) {
        let data;
        if (from_id == 0) {
            data = await Resource.get({
                service: 'orion',
                resource: 'message.messages',
                data: {
                    session: group_id,
                    _p_from: from_id,
                    _p_count: 50
                }
            })
        } else {
            data = await Resource.get({
                service: 'orion',
                resource: 'message.messages',
                data: {
                    session: group_id,
                    _p_from: 0,
                    _p_count: 50,
                    "__f-id-gt": from_id
                }
            })
        }
        let current_new_msgs = []
        let messages = data.messages;
        let self = this;
        messages = messages.reverse();
        messages.forEach(message => {
            let msg = JSON.parse(message.content)
            let msgData = self.initMSG(msg, msg.from == self.getLoginName(selfid), message.id);
            let chatMsg = wx.getStorageSync(self.getRoomName(msgData)) || []
            chatMsg.push(msgData)
            current_new_msgs.push(msgData)
            wx.setStorage({
                key: self.getRoomName(msgData),
                data: chatMsg,
                success: function () {
                    console.log('success')
                }
            })
        });
        return current_new_msgs;
    }
    async getHistroyGroupMsgs(group_id, self_id, current_fromid = 0) {
        let data = await Resource.get({
            service: 'orion',
            resource: 'message.messages',
            data: {
                session: group_id,
                _p_from: current_fromid,
                _p_count: 50
            }
        })
        let messages = data.messages;
        let self = this;
        let current_new_msgs = [];
        messages.forEach(message => {
            let msg = JSON.parse(message.content)
            let msgData = self.initMSG(msg, msg.from == self.getLoginName(self_id), message.id);
            current_new_msgs.push(msgData)
        });
        return current_new_msgs;
    }
}

export default MessageService;