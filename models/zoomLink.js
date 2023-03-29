const db = require('../utils/database');

module.exports = class ZoomLink{
    timeText;
    constructor(id){
        this.id = id;
    }
    setTopic(topic){
        this.topic = topic;
    }
    setPwd(pwd){
        this.pwd = pwd;
    }
    setUrl(url){
        this.url = url;
    }
    setStartElapsed(smin){
        this.smin = smin;
    }
    setEndElapsed(emin){
        this.emin = emin;
    }
    setStatus(status){
        this.status = status;
    }
    saveStatus(){
        //status 0 offline
        //status 1 online
        if(this.status){
            return db.execute(
                "UPDATE zoom_link set status = ?, start_time = CURRENT_TIMESTAMP, end_time = null where link_id = ?",
                [this.status,this.id]
            );
        }
        return db.execute(
            "UPDATE zoom_link set status = ?, start_time = null, end_time = CURRENT_TIMESTAMP where link_id = ?",
            [this.status,this.id]
        );
    }
    save(edit=0){
        if(edit){
            return db.execute(
                "UPDATE zoom_link SET topic = ? WHERE link_id= ?",
                [this.topic,this.id]
            );
        }
        return db.execute(
            "INSERT INTO zoom_link (link_id,topic,pwd) VALUES (?,?,?)",
            [this.id,this.topic,this.pwd]
        );
    }
    setTimeText =()=>{
        if(this.smin!=null){
            this.timeText = ZoomLink.timeConvert(this.smin);
        }
    }
    static timeConvert(m){
        var mins = m;
        var hours = (mins / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        var text = "Started ";
        var hourText = "";
        var minText = "";
        if(rhours){
            if(rhours==1){
                hourText += rhours+" hour";
            }else{
                hourText += rhours+" hours";
            }
        }
        if(rminutes){
            if(rminutes==1){
                minText += rminutes+" minute";
            }else{
                minText += rminutes+" minutes";
            }
        }
        if(rhours){
            text += hourText;     
        }
        if(rminutes){
            if(rhours){
                text+= ", ";
            }
            text += minText;
        }
        text += " ago.";
        if(mins==0){
            text = "Started just now.";
        }
        return text;
    }
    saveUrl(){
        return db.execute(
            "UPDATE zoom_link SET url = ? WHERE link_id = ?",
            [this.url,this.id]
        )
    }
    delete(){
        return db.execute(
            "DELETE FROM zoom_link where link_id = ?",
            [this.id]
        );
    }
    assignUser(user_id){
        return db.execute(
            "INSERT INTO assign (user_id,link_id) VALUES (?,?)",
            [user_id,this.id]
        );
    }
    static anyOtherMeetingLive(url){
        return db.execute(
            "SELECT COUNT(*) AS C FROM zoom_link WHERE status = 1 and url != ?",
            [url]
        );
    }

    static findByUrl(url){
        return db.execute(
            "SELECT link_id,topic,pwd,status,TIMESTAMPDIFF(minute,start_time,current_timestamp) AS smin,TIMESTAMPDIFF(minute,end_time,current_timestamp) AS emin,url FROM zoom_link WHERE url=?",
            [url]
        ).then(result=>{
            if(result[0].length!=0){
                const data = result[0][0];
                const link = new ZoomLink(data.link_id);
                link.setTopic(data.topic);
                link.setStatus(data.status);
                link.setPwd(data.pwd);
                link.setUrl(url);
                link.setEndElapsed(data.emin);
                link.setStartElapsed(data.smin);
                link.setTimeText();
                return link;
            }else{
                throw new Error("No URL");
            }
        })
        .catch(err=>{
            if(err.message=="No URL"){
                return "No URL";
            }
            else{
                return "Fail";
            }
        })
    }
    getAssignedUsers(){
        return db.execute(
            "SELECT user_id,link_id,fname,lname,email FROM assign NATURAL JOIN zoom_link WHERE link_id = ?",
            [this.id]
        );
    }
    static getNumOfLinks(){
        return db.execute(
            "SELECT COUNT(*) as C FROM zoom_link"
        )
        .then((result)=>{
            return  result[0][0].C;
        });
    }
    static getLinks(){
        return db.execute(
            "SELECT link_id,topic,pwd,status,TIMESTAMPDIFF(minute,start_time,current_timestamp) AS smin,TIMESTAMPDIFF(minute,end_time,current_timestamp) AS emin,url FROM zoom_link"
        ).then((result)=>{
            return  result[0];
        });
    }
    static assignUser(user_id,link_id){
        return db.execute(
            "INSERT INTO assign (user_id,link_id) VALUES (?,?)",
            [user_id,link_id]
        );
    }
    static unAssignUser(user_id,link_id){
        return db.execute(
            "DELETE FROM assign where user_id = ? and link_id = ?",
            [user_id,link_id]
        );
    }
    static getAssignedUsers(link_id){
        return db.execute(
            "SELECT user_id,link_id,fname,lname,email FROM assign NATURAL JOIN user WHERE link_id = ?",
            [link_id]
        );
    }
    static getUnassignedUsers(link_id,search=null){
        if(search){
            search = "%"+search+"%"
            return db.execute(
                "SELECT user_id,fname,lname,email FROM user WHERE (user_id NOT IN (SELECT user_id FROM assign where link_id = ?)) and (fname LIKE ? OR lname LIKE ?);",
                [link_id,search,search]
            );
        }
        return db.execute(
            "SELECT user_id,fname,lname,email FROM user WHERE user_id NOT IN (SELECT user_id FROM assign WHERE link_id = ?)",
            [link_id]
        );
    }
}