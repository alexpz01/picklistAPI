const Token = require("../controllers/Token")
const { isValid } = require("../controllers/Token")
const Response = require("./Response")

class GlobalMidlewares {

    // validates the token received in the request
    static validateToken = (req, res, next) => {
        const bearer = req.headers.authorization
        if (!bearer) {
            req.response.addError("Token no presente o invalido")
            res.sendResponse()
        }
        const token = bearer.split(" ")[1]
        if (isValid(token)) {
            req.token = token
            next()
        } else {
            req.response.addError("Token no presente o invalido")
            res.sendResponse()
        }
    }

    // creates a response object that can be accessed in the following middlewares
    static responseCreate = (req, res, next) => {
        const response = new Response(req.body)
        req.response = response
        next()
    }


    // creates the function that sends the response to the client and that can be accessed in the following middleware
    static sendFunctionCreate = (req, res, next) => {
        res.sendResponse = function() {
            res.send(req.response.getResponse()) 
        }
        next()
    }
}

module.exports = GlobalMidlewares