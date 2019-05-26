import Config from '../config'

class EmojiService{
    constructor(config=null) {
        if(!config){
            config = Config
        }
        this.EmojiList = config.Emoji;
        this.EmojiObj = config.EmojiObj;
    }

    parseEmoji(msg) {
        if (typeof this.EmojiList === "undefined" || typeof this.EmojiList.map === "undefined") {
            return msg;
        }
        var emoji = this.EmojiList
        var reg = null
        var msgList = [];
        var objList = [];
        for (var face in emoji.map) {
            if (emoji.map.hasOwnProperty(face)) {
                while (msg.indexOf(face) > -1) {
                    msg = msg.replace(face, "^" + emoji.map[face] + "^");
                }
            }
        }
        var ary = msg.split("^");
        var reg = /^e.*g$/;
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] != "") {
                msgList.push(ary[i]);
            }
        }
        for (var i = 0; i < msgList.length; i++) {
            if (reg.test(msgList[i])) {
                var obj = {};
                obj.data = msgList[i];
                obj.type = "emoji";
                objList.push(obj);
            }
            else {
                var obj = {};
                obj.data = msgList[i];
                obj.type = "txt";
                objList.push(obj);
            }
        }
        console.log(objList);
        return objList;

    }
}

export default EmojiService;