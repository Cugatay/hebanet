const express = require("express");
const app = express();
var upload = require("express-fileupload");
var cors = require('cors')

const models = require('../models/index')


const db = {
  works: [
    { id: 123456, type: "pdf" },
    { id: 1234567, type: "docx" },
    { id: 12345678, type: "pdf" }
  ]
};

app.use(cors())

app.post("/getwork", async (req, res) => {
  const body = req.body;

  if(body.workId != undefined && ( (body.username != undefined && body.username != "" && body.password != undefined && body.password != "") || (body.token != undefined && body.token != "") ) ){
      const { username, password, token, workId } = req.body
    var work = await models.work.getWork(req.body)
    res.status(200).json(work)
  }
  else{
    res.status(200).json({ err: "Gerekli alanlar boş bırakılamaz" })
  }
})

app.post("/getdashboard", async (req, res) => {
  const body = req.body  
  if(( (body.username != undefined && body.username != "" && body.password != undefined && body.password != "") || (body.token != undefined && body.token != "") ) ){
 
    const { username, password, token, workId } = body
    const work = await models.work.getDashboard({username, password, token, workId})
    res.status(200).json(work)
    }
  else{
    res.status(200).json({ err: "Gerekli alanlar boş bırakılamaz" })
  }
})

app.post("/searchwork", async (req, res) => {
  if(req.body.title != undefined){
    var works = await models.work.searchWork(req.body.title)
    res.status(200).json(works)
  }
  else{
    res.status(200).json({err: "Çalışmaları arayabilmek için başlık gerekir"})
  }
})

app.post("/creatework", async (req, res) => {
  var { type, username, password, token, title, subtitle, image, fileType, finish } = req.body;

  if(type != undefined && type != "" && ((username != undefined && username != "" && password != undefined && password != "") || (token != undefined && token != "")) && title != undefined && title != ""){
            var work = await models.work.createWork(req.body)
            res.status(200).json(work)
  }
  else{
    res.status(200).json({err: "Gerekli alanlar boş bırakılamaz"})
  }

})

app.post("/dowork", async (req,res) => {
  if(req.body.workId != undefined && ((req.body.username != undefined && req.body.password != undefined) || req.body.token != undefined) && req.body.answers != undefined){
    const work = await models.work.doWork(req.body)
    res.status(200).json(work)
  }
  else{
    res.status(200).json({ err: "Gerekli veriler sağlanamadı. Giriş yaptığınızdan emin olun" })
  }
})

app.post("/comment", async (req, res) => {
  if(req.body.workId != undefined && ((req.body.username != undefined && req.body.password != undefined) || req.body.token != undefined) && req.body.commentary != undefined){
    const work = await models.work.comment(req.body)
    res.status(200).json(work)
  }
  else{
    res.status(200).json({ err: "Gerekli alanlar boş bırakılamaz" })
  }
})

app.post("/getuser", async (req, res) => {
  if(req.body.token != undefined || (req.body.username != undefined && req.body.password != undefined) && req.body.why){
      let user;
    if(req.body.token == undefined)
     user = await models.user.getUser(req.body.username, req.body.password, req.body.why)
    else
    user = await models.user.getUser(null, null, req.body.why, req.body.token)
    
    res.status(200).json(user)
  }
  else{
    res.status(200).json({ err: "Alanlar boş bırakılamaz!" })
  }
  })

app.post("/searchuser", async (req, res) => {
  if(req.body.name != undefined){
    const users = await models.user.searchUser(req.body.name)
    res.status(200).json(users)
  }
  else
    res.status(200).json([{ err: "Kullanıcı adı boş" }])
})

app.post("/createuser", async (req, res) => {
  if(req.body.name != undefined && req.body.password != undefined && req.body.name != undefined){
    const user = await models.user.createUser(req.body.name, req.body.password, req.body.username)
    res.status(200).json(user)
  }
  else
    res.status(200).json({ error: "Gerekli alanlar boş bırakılmamalıdır" })
})

app.post("/adduser", async (req, res) => {
  if(req.body.token != undefined || (req.body.username != undefined && req.body.password != undefined) && req.body.targetUsername != undefined){
    const user = await models.user.addUser(req.body.username, req.body.password, req.body.targetUsername, req.body.token )
    res.status(200).json(user)
  }
  else
    res.status(200).json({ error: "Gerekli alanlar boş bırakılmamalıdır" })
})

app.post("/removeuser", async (req, res) => {
  if(req.body.token != undefined || (req.body.username != undefined && req.body.password != undefined) && req.body.targetUsername != undefined){
    const user = await models.user.removeUser(req.body.username, req.body.password, req.body.targetUsername, req.body.token )
    res.status(200).json(user)
  }
  else
    res.status(200).json({ error: "Gerekli alanlar boş bırakılmamalıdır" })
})

module.exports = {
  path: "/api",
  handler: app
};
