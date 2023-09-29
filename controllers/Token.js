const { sign, verify, decode } = require("jsonwebtoken");

class Token {
    static createLoginToken(userId) {
        return sign({userId : userId, type : "login-token"}, process.env.SECRET_TOKEN_KEY)
    }

    static createConfirmToken(userId) {
        return sign({userId : userId, type : "verify-token"}, process.env.SECRET_TOKEN_KEY)
    }

    static isValid(token) {
        try {
            verify(token, process.env.SECRET_TOKEN_KEY)
            return true
        } catch(e) {
            return false
        }
    }

    static getID(token) {
        return verify(token, process.env.SECRET_TOKEN_KEY).userId
    }

    static getType(token) {
        return verify(token, process.env.SECRET_TOKEN_KEY).type
    }
}

module.exports = Token