const mongoose = require("mongoose")
const User = require("../models/User")
const Token = require("./Token")

class Database {

    // connects to the mongodb database
    init() {
        return mongoose.connect(process.env.MONGODB_CONNECT_STRING)
    }

    // checks if a user is registered in the database
    static userExists(user) {
        return new Promise((resolve, reject) => {
            const regex = new RegExp(`^(${user})$`, "i")
            User.find({user_name : {"$regex" : regex}}).then((res) => {
                if (res.length == 1) {
                    resolve(true)
                } else {
                    resolve(false)
                }        
            })
        }) 
    }

    // checks if a mail is registered in the database
    static mailExists(mail) {
        return new Promise((resolve, reject) => {
            const regex = new RegExp(`^(${mail})$`, "i")
            User.find({mail : {"$regex" : regex}}).then((res) => {
                if (res.length == 1) {
                    resolve(true)
                } else {
                    resolve(false)
                }        
            })
        }) 
    }

    // checks if a user has verified their email
    static isConfirmed(id) {
        return new Promise((resolve, reject) => {
            User.find({_id : id}).then((res) => {
                if (res.length == 1) {
                    return res[0]
                }    
            }).then(({is_confirmed}) => {
                resolve(is_confirmed)
            })  
        }) 
    }

    // confirm email address
    static confirmMail(token) {
        const promise = new Promise((resolve, reject) => {
            
            if(!Token.isValid(token)) {
                reject()
            }
            if (Token.getType(token) != "verify-token") {
                reject()
            }
            
            const tokenId = Token.getID(token)
            Database.isConfirmed(tokenId).then((confirmed) => {
                if (confirmed) {
                    reject()
                } else {
                    User.updateOne({_id : tokenId}, {is_confirmed : true}).then(() => {
                        resolve()
                    }).catch(() => {
                        reject()
                    })
                }
            })
        }) 
        return promise
        
    }
}

module.exports = Database