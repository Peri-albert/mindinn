import SessionService from './session_service'


class QueueService {
    constructor() {
        this.Session = new SessionService()
    }

    reset(uid) {
        let id = this.Session.getRoomName(uid)
        let id2chatroom = this.Session.getId2Chatroom();
        let chatlists = this.Session.getChatlist();

        let index = chatlists.indexOf(id);
        if (index != -1) {
            id2chatroom[id].unread_count = 0;
        }
        this.Session.setId2Chatroom(id2chatroom);

    }

    join(uid, message = null, isRead = true) {
        let id = this.Session.getRoomName(uid)
        let chatlists = this.Session.getChatlist();
        let id2chatroom = this.Session.getId2Chatroom();

        let index = chatlists.indexOf(id);
        if (index != -1) {
            chatlists.splice(index, 1)
            chatlists.unshift(id);
            if (message) {
                id2chatroom[id].last_chat = message;
            }
            id2chatroom[id].unread_count = 0;
        } else {
            chatlists.unshift(id);
            if (!message) {
                message = {};
            }
            id2chatroom[id] = {
                "unread_count": 0,
                "last_chat": message,
                "user_id": uid,
                "self_id": this.Session.getSelfId(),
                "id": id
            };
        }
        if (!isRead) {
            id2chatroom[id].unread_count += 1;
        }

        this.Session.setChatlist(chatlists);
        this.Session.setId2Chatroom(id2chatroom);
    }
    remove(id) {
        let chatlists = this.Session.getChatlist();
        let id2chatroom = this.Session.getId2Chatroom();

        let index = chatlists.indexOf(id);
        if (index != -1) {
            chatlists.splice(index, 1)
            delete id2chatroom[id]
        }
        this.Session.setStorageData(id, [])

        this.Session.setChatlist(chatlists);
        this.Session.setId2Chatroom(id2chatroom);
    }
    getLists() {
        let chatlists = this.Session.getChatlist();
        let id2chatroom = this.Session.getId2Chatroom();

        let data = [];
        chatlists.forEach((id, index) => {
            data.push(id2chatroom[id]);
        });
        return data;
    }
    getCachedUserInfos(ids) {
        let id2userinfo = this.Session.getUsers();
        let data = {}
        ids.forEach(id => {
            if(Object.keys(id2userinfo).indexOf(id.toString()) >=0 ){
                data[parseInt(id)] = id2userinfo[id]
            }
        });
        return data
    }
    getUnloadUids(ids) {
        let uids = this.Session.getUserIdList();
        let needids = []
        ids.forEach(id => {
            if(uids.indexOf(id)<0){
                needids.push(id)
            }
        });
        return needids
    }
    updateUinfos(data){
        let infos = {}
        data.forEach(info => {
            infos[info.id] = info
        });
        this.Session.updateUsers(infos)
    }
}

export default QueueService;