import _ from '../lib/mptool';
import WxNotifyService from './weixin_notify_service';
import WebIM from '../lib/webim/webim'

let EmojiConfig = {
    Emoji: {
        path: "https://resource.vxiaocheng.com/mercury/faces/",
        map: {
            "[):]": "ee_1.png",
            "[:D]": "ee_2.png",
            "[;)]": "ee_3.png",
            "[:-o]": "ee_4.png",
            "[:p]": "ee_5.png",
            "[(H)]": "ee_6.png",
            "[:@]": "ee_7.png",
            "[:s]": "ee_8.png",
            "[:$]": "ee_9.png",
            "[:(]": "ee_10.png",
            "[:'(]": "ee_11.png",
            "[<o)]": "ee_12.png",
            "[(a)]": "ee_13.png",
            "[8o|]": "ee_14.png",
            "[8-|]": "ee_15.png",
            "[+o(]": "ee_16.png",
            "[|-)]": "ee_17.png",
            "[:|]": "ee_18.png",
            "[*-)]": "ee_19.png",
            "[:-#]": "ee_20.png",
            "[^o)]": "ee_21.png",
            "[:-*]": "ee_22.png",
            "[8-)]": "ee_23.png",
            "[del]": "btn_del.png",
            "[(|)]": "ee_24.png",
            "[(u)]": "ee_25.png",
            "[(S)]": "ee_26.png",
            "[(*)]": "ee_27.png",
            "[(#)]": "ee_28.png",
            "[(R)]": "ee_29.png",
            "[({)]": "ee_30.png",
            "[(})]": "ee_31.png",
            "[(k)]": "ee_32.png",
            "[(F)]": "ee_33.png",
            "[(W)]": "ee_34.png",
            "[(D)]": "ee_35.png"
        }
    },

    EmojiObj: {
        path: "https://resource.vxiaocheng.com/mercury/faces/",
        map1: {
            "[):]": "ee_1.png",
            "[:D]": "ee_2.png",
            "[;)]": "ee_3.png",
            "[:-o]": "ee_4.png",
            "[:p]": "ee_5.png",
            "[(H)]": "ee_6.png",
            "[:@]": "ee_7.png"
        },
        map2: {
            "[:s]": "ee_8.png",
            "[:$]": "ee_9.png",
            "[:(]": "ee_10.png",
            "[:'(]": "ee_11.png",
            "[<o)]": "ee_12.png",
            "[(a)]": "ee_13.png",
            "[8o|]": "ee_14.png"
        },
        map3: {
            "[8-|]": "ee_15.png",
            "[+o(]": "ee_16.png",
            "[|-)]": "ee_17.png",
            "[:|]": "ee_18.png",
            "[*-)]": "ee_19.png",
            "[:-#]": "ee_20.png",
            "[del]": "del.png"
        },
        map4: {
            "[^o)]": "ee_21.png",
            "[:-*]": "ee_22.png",
            "[8-)]": "ee_23.png",
            "[(|)]": "ee_24.png",
            "[(u)]": "ee_25.png",
            "[(S)]": "ee_26.png",
            "[(*)]": "ee_27.png"
        },
        map5: {
            "[(#)]": "ee_28.png",
            "[(R)]": "ee_29.png",
            "[({)]": "ee_30.png",
            "[(})]": "ee_31.png",
            "[(k)]": "ee_32.png",
            "[(F)]": "ee_33.png",
            "[(W)]": "ee_34.png",
            "[(D)]": "ee_35.png"
        },
        map6: {
            "[del]": "del.png"
        }
    }
}

class WebIMService extends WebIM {
    constructor() {
        super(EmojiConfig);
    }
    async sendIMmsg(type, to_user_id, contentstr, fromuserInfo, duration=0) {
        let msgData = await this.Message.add(type, to_user_id, contentstr, duration)
        msgData = this._initMSG(msgData)
        this.Session.appendMsgs(to_user_id, [msgData])
        this.Queue.join(to_user_id, msgData)
        if (type != 'gift') {
            WxNotifyService.sendNotice(to_user_id, this.Session.getSelfId(), msgData, fromuserInfo);
        }
        return msgData
    }
    async sendGiftMsg(to_user_id, giftname, fromuserInfo) {
        var msgData = await this.sendIMmsg('gift', to_user_id, giftname, fromuserInfo);
        msgData.type = "text"
        msgData.data[0].data = `收到一个礼物 ${giftname}`
        WxNotifyService.sendNotice(to_user_id, this.Session.getSelfId(), msgData, fromuserInfo);
        return msgData
    }

}

let service = new WebIMService();

export default service;