const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const Database = require("./controllers/Database")
const GlobalMiddlewares = require("./controllers/GlobalMiddlewares")
const Login = require("./controllers/Login")
const Token = require("./controllers/Token")
const SignUp = require("./controllers/SignUp")

dotenv.config()

const db = new Database()
db.init().catch((error) => {
    console.log(error)
}).then((res) => {
    console.log("Connected")
})

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(GlobalMiddlewares.responseCreate)
app.use(GlobalMiddlewares.sendFunctionCreate)

app.post("/api/getdata", GlobalMiddlewares.validateToken, (req, res) => {
    res.sendResponse()
})

app.post("/api/login", (req, res) => {

    new Login({user : req.body.user, password : req.body.password}).tryLogin()
    .then(([response, user_id]) => {
        req.response.addResult(Token.createLoginToken(user_id))
        res.sendResponse()
    }).catch((error) => {
        req.response.addError(error)
        res.sendResponse()
    })

})

app.post("/api/signup", (req, res) => {

    new SignUp({name : req.body.name, user : req.body.user, mail : req.body.mail, password : req.body.password})
    .trySignUp()
    .then((status) => {
        res.sendResponse()
    }).catch((error) => {
        req.response.addError(error)
        res.sendResponse()
    })

})


app.get("/api/isValidToken", GlobalMiddlewares.validateToken, (req, res) => {
    res.sendResponse()
})

app.get("/api/confirmation/:token", (req, res) => {
    Database.confirmMail(req.params.token).then(() => {
        res.sendStatus(200)
    }).catch(() => {
        res.sendStatus(404)
    })
})

app.get("/api/getconfirmtoken", GlobalMiddlewares.validateToken, (req, res) => {
    res.send(Token.createConfirmToken(Token.getID(req.token)))
})

app.listen(5000)