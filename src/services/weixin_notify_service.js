import Service from './service';
import Resource from '../lib/resource';
import _ from '../lib/mptool';


class WeixinNotificationService extends Service {
    constructor() {
        super();
    }
    async sendNotice(userid, selfid, msgData, from_userinfo) {
        let resource = "weixin.notification";
        let content = msgData.data;
        if (msgData.type == "img") {
            content = "[一张照片]";
        } else if (msgData.type == "audio") {
            content = "[一段语音]";
        } else if (content.length > 1) {
            content = "[一条消息]"
        } else {
            content = content[0].data.indexOf("礼物") == -1 ? "托我给你捎句悄悄话，快去看看。" : content[0].data;
        }
        let data = JSON.stringify({
            username: from_userinfo.name,
            content: content,
            time: msgData.time,
            type: "泡泡私聊",
            touserid: selfid
        })

        let resdata = await Resource.put({
            service: 'gaia',
            resource: resource,
            data: {
                apptype: "mercury",
                userid: userid,
                data: data,
                notice_type: "chat",
            }
        })

        return resdata;
    }
    async sendPendingApprovalNotice(userId, content, userName) {
        let params = {
            'content': content,
            'name': userName,
            'time': _.getFormatTime(),
        }

        console.log(params)

        let data = await Resource.put({
            service: 'gaia',
            resource: 'weixin.notification',
            data: {
                apptype: "mercury",
                userid: userId,
                data: JSON.stringify(params),
                notice_type: "pending_approval",
            }
        })

        return data;
    }
    async sendVerifyResultNofitication(userId, content, result) {
        let params = {
            'content': content,
            'result': result,
            'time': _.getFormatTime(),
        }

        console.log(params);

        let data = await Resource.put({
            service: 'gaia',
            resource: 'weixin.notification',
            data: {
                apptype: "mercury",
                userid: userId,
                data: JSON.stringify(params),
                notice_type: "verify_result",
            }
        })

        return data;
    }
    async sendWithdrawNofitication(userId, money, status) {
        let params = {
            'money': money + "元",
            'status': status,
            'time': _.getFormatTime(),
            'tip': "有钱真好！又可以快活啦~~"
        }

        console.log(params);

        let data = await Resource.put({
            service: 'gaia',
            resource: 'weixin.notification',
            data: {
                apptype: "mercury",
                userid: userId,
                data: JSON.stringify(params),
                notice_type: "withdraw",
            }
        })

        return data;
    }
    async sendMatchNofitication(userId, targetId, object, tag) {
        let params = {
            'object': object,
            'tag': tag,
            'time': _.getFormatTime(),
            'tip': "抓住缘分的小尾巴~马上去泡ta~",
            'target_id': targetId.toString()
        }

        console.log(params);

        let data = await Resource.put({
            service: 'gaia',
            resource: 'weixin.notification',
            data: {
                apptype: "mercury",
                userid: userId,
                data: JSON.stringify(params),
                notice_type: "match",
            }
        })

        return data;
    }
    async sendScheduleNofitication(userId, topic, description) {
        let params = {
            'topic': topic,
            'description': description,
            'tip': "跟着土豪走，吃喝全都有，现在申请加入豪局"
        }

        console.log(params);

        let data = await Resource.put({
            service: 'gaia',
            resource: 'weixin.notification',
            data: {
                apptype: "mercury",
                userid: userId,
                data: JSON.stringify(params),
                notice_type: "schedule",
            }
        })

        return data;
    }
    async sendTaskNofitication(userId, name, people, content, remark) {
        let params = {
            'name': name,
            'people': "局主" + people,
            'content': content,
            'remark': remark
        }

        console.log(params);

        let data = await Resource.put({
            service: 'gaia',
            resource: 'weixin.notification',
            data: {
                apptype: "mercury",
                userid: userId,
                data: JSON.stringify(params),
                notice_type: "task",
            }
        })

        return data;
    }
    async sendReplyNofitication(userId, name, content, topic, toPage) {
        let params = {
            'name': name,
            'content': content,
            'time': _.getFormatTime(),
            'topic': topic,
            'toPage': toPage
        }

        console.log(params);

        try {
            let data = await Resource.put({
                service: 'gaia',
                resource: 'weixin.notification',
                data: {
                    apptype: "mercury",
                    userid: userId,
                    data: JSON.stringify(params),
                    notice_type: "reply",
                }
            })
            return data;
        } catch(e) {
            console.error("发送通知失败");
        }
    }
    async sendCommentNofitication(userId, name, content, topic) {
        let params = {
            'name': name,
            'content': content,
            'time': _.getFormatTime(),
            'topic': topic
        }

        console.log(params);

        let data = await Resource.put({
            service: 'gaia',
            resource: 'weixin.notification',
            data: {
                apptype: "mercury",
                userid: userId,
                data: JSON.stringify(params),
                notice_type: "comment",
            }
        })

        return data;
    }
    async sendRechargeNofitication(userId, money, tip) {
        let params = {
            'money': money + "元",
            'time': _.getFormatTime(),
            'tip': tip
        }

        console.log(params);

        let data = await Resource.put({
            service: 'gaia',
            resource: 'weixin.notification',
            data: {
                apptype: "mercury",
                userid: userId,
                data: JSON.stringify(params),
                notice_type: "recharge",
            }
        })

        return data;
    }
}

let service = new WeixinNotificationService();

export default service;