const express = require("express");
const app = express();
var upload = require("express-fileupload");
var cors = require("cors");

const models = require("../models/index");

const db = {
  works: [
    { id: 123456, type: "pdf" },
    { id: 1234567, type: "docx" },
    { id: 12345678, type: "pdf" }
  ]
};

app.use(cors());

app.post("/getwork", async (req, res) => {
  const body = req.body;

  if (
    body.workId != undefined &&
    ((body.username != undefined &&
      body.username != "" &&
      body.password != undefined &&
      body.password != "") ||
      (body.token != undefined && body.token != ""))
  ) {
    const { username, password, token, workId } = req.body;
    var work = await models.work.getWork(req.body);
    res.status(200).json(work);
  } else {
    res.status(200).json({ err: "Gerekli alanlar boş bırakılamaz" });
  }
});

app.post("/getdashboard", async (req, res) => {
  const body = req.body;
  if (
    (body.username != undefined &&
      body.username != "" &&
      body.password != undefined &&
      body.password != "") ||
    (body.token != undefined && body.token != "")
  ) {
    const { username, password, token, workId, notequals } = body;
    let notequalsSQL = "";

    if (notequals != undefined) {
      if (notequals[0] != undefined) {
        notequals.forEach(id => {
          notequalsSQL +=
            notequalsSQL == undefined || notequalsSQL == ""
              ? `id != '${id}'`
              : `AND id != '${id}'`;
        });
        console.log("------------------------");
        console.log(notequalsSQL);
        console.log("------------------------");
      }
    }

    const work = await models.work.getDashboard({
      username,
      password,
      token,
      workId,
      notequals: notequalsSQL == "" ? undefined : notequalsSQL
    });
    res.status(200).json(work);
  } else {
    res.status(200).json({ err: "Gerekli alanlar boş bırakılamaz" });
  }
});

app.post("/searchwork", async (req, res) => {
  if (req.body.title != undefined) {
    var works = await models.work.searchWork(req.body.title);
    res.status(200).json(works);
  } else {
    res
      .status(200)
      .json({ err: "Çalışmaları arayabilmek için başlık gerekir" });
  }
});

app.post("/creatework", async (req, res) => {
  var {
    type,
    username,
    password,
    token,
    title,
    subtitle,
    image,
    fileType,
    finish,
    answers
  } = req.body;

  if (
    type != undefined &&
    type != "" &&
    ((username != undefined &&
      username != "" &&
      password != undefined &&
      password != "") ||
      (token != undefined && token != "")) &&
    title != undefined &&
    title != ""
  ) {
    if (
      !(
        type == "homework" &&
        (answers == undefined || answers[0] == undefined || answers[0] == "")
      )
    ) {
      if (
        !(
          type == "survey" &&
          (answers == undefined ||
            answers[0] == null ||
            answers[0] == "" ||
            answers[1] == null ||
            answers[1] == "")
        )
      ) {
        if (answers.filter != undefined) {
          var answerBool = answers.filter(answer => {
            return answer == "";
          });
          var answerBool2 = answers.filter(answer => {
            return answer == undefined;
          });
          var answerBool3 = false;
          if (answerBool[0] == undefined && answerBool2[0] == undefined) {
            if (type == "survey") {
              // answers.forEach();
            }
            var work = await models.work.createWork(req.body);
            res.status(200).json(work);
          } else {
            if (type == "text") {
              var work = await models.work.createWork(req.body);
              res.status(200).json(work);
            } else {
              res.status(200).json({ err: "Boş seçenek gönderilemez" });
            }
          }
        } else {
          res.status(200).json({ err: "En az 2 seçenek girmelisiniz" });
        }
      } else {
        res.status(200).json({ err: "En az 2 seçenek girmelisiniz" });
      }
    } else {
      res.status(200).json({ err: "Cevap anahtarını eksiksiz girmeniz gerek" });
    }
  } else {
    res.status(200).json({ err: "Gerekli alanlar boş bırakılamaz" });
  }
});

app.post("/dowork", async (req, res) => {
  if (
    req.body.workId != undefined &&
    ((req.body.username != undefined && req.body.password != undefined) ||
      req.body.token != undefined) &&
    req.body.answers != undefined
  ) {
    const work = await models.work.doWork(req.body);
    res.status(200).json(work);
  } else {
    res.status(200).json({
      err: "Gerekli veriler sağlanamadı. Giriş yaptığınızdan emin olun"
    });
  }
});

app.post("/comment", async (req, res) => {
  if (
    req.body.workId != undefined &&
    ((req.body.username != undefined && req.body.password != undefined) ||
      req.body.token != undefined) &&
    req.body.commentary != undefined
  ) {
    const work = await models.work.comment(req.body);
    res.status(200).json(work);
  } else {
    res.status(200).json({ err: "Gerekli alanlar boş bırakılamaz" });
  }
});

app.post("/getuser", async (req, res) => {
  if (
    req.body.token != undefined ||
    (req.body.username != undefined &&
      req.body.password != undefined &&
      req.body.why)
  ) {
    let user;
    if (req.body.token == undefined)
      user = await models.user.getUser(
        req.body.username,
        req.body.password,
        req.body.why
      );
    else
      user = await models.user.getUser(
        null,
        null,
        req.body.why,
        req.body.token
      );

    res.status(200).json(user);
  } else {
    res.status(200).json({ err: "Alanlar boş bırakılamaz!" });
  }
});

app.post("/searchuser", async (req, res) => {
  if (req.body.name != undefined) {
    const users = await models.user.searchUser(req.body.name);
    res.status(200).json(users);
  } else res.status(200).json([{ err: "Kullanıcı adı boş" }]);
});

app.post("/createuser", async (req, res) => {
  if (
    req.body.name != undefined &&
    req.body.password != undefined &&
    req.body.name != undefined
  ) {
    const user = await models.user.createUser(
      req.body.name,
      req.body.password,
      req.body.username
    );
    res.status(200).json(user);
  } else
    res.status(200).json({ error: "Gerekli alanlar boş bırakılmamalıdır" });
});

app.post("/adduser", async (req, res) => {
  if (
    req.body.token != undefined ||
    (req.body.username != undefined &&
      req.body.password != undefined &&
      req.body.targetUsername != undefined)
  ) {
    const user = await models.user.addUser(
      req.body.username,
      req.body.password,
      req.body.targetUsername,
      req.body.token
    );
    res.status(200).json(user);
  } else
    res.status(200).json({ error: "Gerekli alanlar boş bırakılmamalıdır" });
});

app.post("/removeuser", async (req, res) => {
  if (
    req.body.token != undefined ||
    (req.body.username != undefined &&
      req.body.password != undefined &&
      req.body.targetUsername != undefined)
  ) {
    const user = await models.user.removeUser(
      req.body.username,
      req.body.password,
      req.body.targetUsername,
      req.body.token
    );
    res.status(200).json(user);
  } else
    res.status(200).json({ error: "Gerekli alanlar boş bırakılmamalıdır" });
});

module.exports = {
  path: "/api",
  handler: app
};
