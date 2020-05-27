var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./sqbase");
var axios = require("axios");

var storageKeys = require("./storageKeys");
var userModel = require("./user");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function getWork({ workId, username, password, token }) {
  return new Promise(async (res, rej) => {
    var user = await userModel.getUser(username, password, "login", token);

    db.all(`SELECT * FROM works WHERE id = '${workId}'`, function(err, rows) {
      if (err) console.log(err);

      if (user.err == undefined) {
        if (rows[0] != undefined) {
          if (user.username == JSON.stringify(rows[0].owner).username) {
            res(rows[0]);
          } else {
            var data = rows[0];
            data.answers = null;
            if (data.makers != undefined)
              data.makers =
                data.makers == undefined || data.makers == ""
                  ? 0
                  : JSON.parse(`[${rows[0].makers}]`).length;
            res(data);
          }
        } else {
          res({ err: "Çalışma bulunamadı. Silinmiş olabilir" });
        }
      } else {
        res({ err: "Kullanıcı adı yada şifre hatalı" });
      }
    });
  });
}

function searchWork(title) {
  return new Promise((res, rej) => {
    db.all(`SELECT * FROM works WHERE title like '%${title}%'`, function(
      err,
      rows
    ) {
      //  TODO: * yerine gerekli parametreler konulacak
      if (err) console.log(err);

      res(rows);
    });
  });
}

async function createWork({
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
}) {
  let fileExtension = "";

  if (type == "homework") {
    fileExtension =
      fileType == "image/jpeg"
        ? "jpeg"
        : fileType == "image/jpg"
        ? "jpg"
        : fileType == "image/png"
        ? "png"
        : fileType == "application/pdf"
        ? "pdf"
        : fileType ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ? "docx"
        : null;
  }

  const id = makeid(10);

  var user = await userModel.getUser(username, password, "login", token);
  var work = await getWork({ id, username, password, token });
  console.log("-asssssss----------------------");
  console.log(work);
  console.log("jej");
  console.log("-----------------------");
  // else
  if (fileExtension != undefined) {
    return new Promise((res, rej) => {
      if (user.err == undefined) {
        const shared = new Date();
        const finishDate = new Date(
          shared.getFullYear(),
          shared.getMonth(),
          shared.getDate() + 5
        );

        if (work.id == undefined) {
          if (
            (type == "homework" && user.role == "teacher") ||
            type == "survey" ||
            type == "text"
          ) {
            console.log(
              `INSERT INTO works(id, type, owner, title, ${
                type == "text" ? "subtitle, " : ""
              } shared, finish, image ${
                type == "homework" || type == "survey" ? ", answers" : ""
              }) VALUES ('${id}', ${
                type == "homework" ? `'homework/${fileExtension}'` : `'${type}'`
              }, '${JSON.stringify({
                username: user.username,
                name: user.name,
                workArea: user.work_area
              })}', '${title}', ${
                type == "text" ? `'${subtitle}', ` : ""
              }'${shared}', '${finishDate}', '${
                image == false || image == null
                  ? type == "homework"
                    ? `default_${user.work_area}`
                    : `default_${type}`
                  : image
              }' ${
                type == "homework" || type == "survey"
                  ? `, '${JSON.stringify(answers)}'`
                  : ""
              })`
            );
            db.all(
              `INSERT INTO works(id, type, owner, title, ${
                type == "text" ? "subtitle, " : ""
              } shared, finish, image ${
                type == "homework" || type == "survey" ? ",answers" : ""
              }) VALUES ('${id}', ${
                type == "homework" ? `'homework/${fileExtension}'` : `'${type}'`
              }, '${JSON.stringify({
                username: user.username,
                name: user.name,
                workArea: user.work_area
              })}', '${title}', ${
                type == "text" ? `'${subtitle}', ` : ""
              }'${shared}', '${finishDate}', '${
                image == false || image == null
                  ? type == "homework"
                    ? `default_${user.work_area}`
                    : `default_${type}`
                  : image
              }' ${
                type == "homework" || type == "survey"
                  ? `, '${JSON.stringify(answers)}'`
                  : ""
              })`,
              function(err, rows) {
                if (err) console.log(err);

                res({ id, type, username, title });
              }
            );
          } else {
            if (type == "homework") {
              res({ err: "Buna yetkiniz yok!" });
            } else res({ err: "Geçersiz paylaşım türü" });
          }
        } else {
          if (work.err != undefined) {
            res(work.err);
          } else {
            res({
              err:
                "Bir hata oluştu, fakat paylaş butonuna bir kez daha basarsanız düzelecektir"
            });
          }
        }
      } else {
        res(user);
      }
    });
  } else {
    return {
      err:
        "Yüklediğiniz ödev dosyası uzantısı geçersiz. Lütfen istediğimiz formatlarda dosyalar yükleyin"
    };
  }
}

async function doWork({ workId, username, password, token, answers }) {
  let user = await userModel.getUser(username, password, "login", token);
  console.log(workId);
  return new Promise((res, rej) => {
    db.all(`SELECT * FROM works WHERE id = '${workId}'`, function(err, rows) {
      if (err) console.log(err);
      let work = rows[0];
      console.log(answers);
      if (answers != undefined || answers != "" || answers[0] != undefined) {
        if (work != undefined) {
          if (user.err == undefined) {
            if (!(user.role == "teacher" && type == "homework")) {
              var workMakers = work.makers;
              var sendingMakers = [];

              JSON.parse(`[${workMakers}]`).forEach(maker => {
                maker.username = null;
                sendingMakers.push(maker);
              });
              sendingMakers.push({
                username: user.username,
                work_area: user.work_area,
                answers: answers
              });
              console.log("parsed");
              console.log(sendingMakers);

              if (workMakers == undefined || workMakers == "") {
                workMakers = `{"username": "${
                  user.username
                }", "answers": ${JSON.stringify(answers)}}`;

                let data = [workMakers, work.id];
                let sql = `UPDATE works SET makers = ? WHERE id = ?`;

                db.run(sql, data, function(err) {
                  if (err) {
                    return console.error(err.message);
                  }

                  res({
                    username: user.username,
                    success: true,
                    makers: sendingMakers
                  });
                });
              } else {
                console.log(`[${workMakers}]`);
                var workMakersBool = JSON.parse(`[${workMakers}]`).find(
                  worker => {
                    return worker.username == user.username;
                  }
                );

                if (!workMakersBool) {
                  workMakers += `,{"username": "${user.username}", "answers": "${answers}"}`;
                  let data = [workMakers, work.id];
                  let sql = `UPDATE works SET makers = ? WHERE id = ?`;

                  db.run(sql, data, function(err) {
                    if (err) {
                      return console.error(err.message);
                    }
                    res({
                      username: user.username,
                      success: true,
                      makers: sendingMakers
                    });
                  });
                } else {
                  res({ err: "Bu ödevi zaten yapmışsınız" });
                }
              }
            } else {
              res({ err: "Öğretmenler ödev yapamaz" });
            }
          } else {
            res(user.err);
          }
        } else {
          res({ err: "Böyle bir çaşışma bulunamadı" });
        }
      } else {
        res({ err: "En az bir soruyu cevaplamalısınız" });
      }
    });
  });
}

function comment({ workId, token, commentary }) {
  if (commentary != undefined) {
    return new Promise((res, rej) => {
      db.all(`SELECT * FROM works WHERE id = (?)`, [workId], async function(
        err,
        rows
      ) {
        if (err) console.log(err);

        if (rows[0] != undefined) {
          const user = await userModel.getUser(null, null, "login", token);

          if (user.err == undefined) {
            let comment = {
              username: user.username,
              name: user.name,
              comment: commentary
            };
            if (user.work_area != undefined) {
              comment.workArea = user.work_area;
            }
            comment = JSON.stringify(comment);

            let newCommends =
              rows[0].comments == undefined || rows[0].comments == ""
                ? `${comment}`
                : `${rows[0].comments}, ${comment}`;

            db.all(
              `UPDATE works SET comments = '${newCommends}' WHERE id = '${rows[0].id}'`,
              function(err, rows) {
                res({ ok: true });
              }
            );
          } else {
            res(user);
          }
        } else {
          res({ err: "Böyle bir çalışma bulunamadı" });
        }
      });
    });
  } else {
    return { err: "Gerekli alanlar boş bırakılamaz" };
  }
}

function getDashboard({ username, password, token, notequals }) {
  return new Promise(async (res, rej) => {
    const user = await userModel.getUser(username, password, "login", token);

    if (user.err == undefined) {
      if (
        (user.friends != undefined && user.friends != "") ||
        (user.teachers != undefined && user.teachers != "")
      ) {
        let userFriendsJSON, userTeachersJSON;
        let userFriendsSQL = "",
          userTeachersSQL = "";

        if (user.friends != "" && user.friends != undefined) {
          userFriendsJSON = JSON.parse(`[${user.friends}]`);
          userFriendsJSON.forEach(user => {
            userFriendsSQL +=
              userFriendsSQL == ""
                ? `owner LIKE '%"username":"${user.username}"%'`
                : ` OR owner LIKE '%"username":"${user.username}"%'`;
          });
        }

        if (user.teachers != "" && user.teachers != undefined) {
          userTeachersJSON = JSON.parse(`[${user.teachers}]`);
          userTeachersJSON.forEach(user => {
            userTeachersSQL += ` ${
              userFriendsSQL != "" || userTeachersSQL != "" ? "OR" : ""
            } owner LIKE '%"username":"${user.username}"%'`;
          });
        }

        db.all(
          `SELECT ${
            /*'id,type,owner,title,subtitle,makers,shared,finish,image,comments'*/ "*"
          } FROM works WHERE (${userFriendsSQL} ${userTeachersSQL}) ${
            notequals != undefined && notequals != "" ? `AND ${notequals}` : ""
          } ORDER BY ${
            notequals != undefined && notequals != ""
              ? "random()"
              : "finish ASC"
          } LIMIT 9`,
          function(err, rows) {
            if (err) console.log(err);

            var deleteSQL = { sql: "", findsql: "", list: [] };
            var now = new Date();
            var selectedSQL = "";

            var sendingWorks = rows.filter(work => {
              var finish = new Date(work.finish);
              if (finish <= now) {
                deleteSQL.sql +=
                  deleteSQL.sql == ""
                    ? `id = '${work.id}'`
                    : ` OR id = '${work.id}'`;
                deleteSQL.findsql +=
                  deleteSQL.findsql == "" || deleteSQL.findsql == undefined
                    ? `id != '${work.id}'`
                    : ` AND id != '${work.id}'`;
                deleteSQL.list.push(`${work.id}_image.${work.image}`);
                if (work.type.startsWith("homework")) {
                  if (work.type.endsWith("docx")) {
                    deleteSQL.list.push(`${work.id}.html`); // DOCX MI DIYE KONTROL ET. CUNKU DOCX FIREBASE'DE .HTML OLARAK KAYITLI
                  } else {
                    deleteSQL.list.push(
                      `${work.id}.${work.type.split("/")[1]}`
                    ); // DOCX MI DIYE KONTROL ET. CUNKU DOCX FIREBASE'DE .HTML OLARAK KAYITLI
                  }
                }
              } else {
                var workMakers = JSON.parse(`[${work.makers}]`);

                var workMakersBool = [];
                var newMakers = "";
                console.log("-------------------");
                console.log(workMakers);
                console.log("-------------------");
                if (workMakers != undefined && workMakers[0] != undefined) {
                  workMakersBool = workMakers.filter((maker, value) => {
                    var workerUsername = maker.username;
                    if (workerUsername != user.username) {
                      workMakers[value].username = null;
                    }
                    newMakers +=
                      newMakers == ""
                        ? JSON.stringify(workMakers[value])
                        : ", " + JSON.stringify(workMakers[value]);
                    return workerUsername == user.username;
                  });
                  console.log(
                    "newMakers - - - - - - - - - - - - - - - --  -- -  - - - - - --  -"
                  );
                  console.log(newMakers);
                  console.log(
                    "newMakers - - - - - - - - - - - - - - - --  -- -  - - - - - --  -"
                  );
                  work.makers = newMakers;
                }
                if (
                  !(work.type == "survey") &&
                  workMakersBool[0] == undefined
                ) {
                  work.answers = null;
                }
                // TODO: Ödevi yapan kişiler görüntülenecek
                if (workMakersBool[0] == undefined || work.type != "survey") {
                  work.makers =
                    work.makers == undefined
                      ? 0
                      : JSON.parse(`[${work.makers}]`).length;
                  work.image = work.image.startsWith("default_")
                    ? `/images/${work.image}`
                    : `${storageKeys.url}/download/${work.id}_image.${work.image}`;
                  selectedSQL += `AND id != '${work.id}'`;
                }
              }
              return finish > now;
            });

            //console.log(sendingWorks)

            if (sendingWorks.length >= 9) {
              res({ rows: sendingWorks });
            } else {
              if (deleteSQL.findsql != "") {
                db.all(
                  `SELECT ${
                    /*'id,type,owner,title,subtitle,makers,shared,finish,image,comments'*/ "*"
                  } FROM works WHERE (${userFriendsSQL} ${userTeachersSQL}) ${
                    notequals != undefined && notequals != ""
                      ? `AND ${notequals}`
                      : ""
                  } ${
                    deleteSQL.findsql != undefined && deleteSQL.findsql != ""
                      ? `AND ${deleteSQL.findsql}`
                      : ""
                  } ${selectedSQL} ORDER BY ${
                    notequals != undefined && notequals != ""
                      ? "random()"
                      : "shared ASC"
                  } LIMIT ${9 - sendingWorks.length}`,
                  function(err, rows2) {
                    console.log("------------&&&&-------------------------");
                    console.log([...sendingWorks, ...rows2]);
                    console.log("------------&&&&-------------------------");
                    if (err) console.log(err);
                    rows2.forEach(work => {
                      var workMakers = JSON.parse(`[${work.makers}]`);

                      var workMakersBool = [];
                      var newMakers = "";
                      console.log("-------------------");
                      console.log(workMakers);
                      console.log("-------------------");
                      if (
                        workMakers != undefined &&
                        workMakers[0] != undefined
                      ) {
                        workMakersBool = workMakers.filter((maker, value) => {
                          var workerUsername = maker.username;
                          workMakers[value].username = null;
                          newMakers +=
                            newMakers == ""
                              ? JSON.stringify(workMakers[value])
                              : ", " + JSON.stringify(workMakers[value]);
                          return workerUsername == user.username;
                        });
                        console.log(
                          "newMakers - - - - - - - - - - - - - - - --  -- -  - - - - - --  -"
                        );
                        console.log(newMakers);
                        console.log(
                          "newMakers - - - - - - - - - - - - - - - --  -- -  - - - - - --  -"
                        );
                        work.makers = newMakers;
                      }
                      if (
                        !(work.type == "survey") &&
                        workMakersBool[0] == undefined
                      ) {
                        work.answers = null;
                      }
                      if (
                        workMakersBool[0] == undefined ||
                        work.type != "survey"
                      ) {
                        work.makers =
                          work.makers == undefined
                            ? 0
                            : JSON.parse(`[${work.makers}]`).length;
                        work.image = work.image.startsWith("default_")
                          ? `/images/${work.image}`
                          : `${storageKeys.url}/download/${work.id}_image.${work.image}`;
                        selectedSQL = `AND id != '${work.id}'`;
                      }
                      // TODO: Yapan kişiler görüntülenebilecek
                    });

                    if ([...sendingWorks, ...rows2].length >= 9) {
                      res({ rows: [...sendingWorks, ...rows2] });
                    } else {
                      res({ finish: true, rows: [...sendingWorks, ...rows2] });
                    }
                  }
                );

                db.all(`DELETE FROM works WHERE ${deleteSQL.sql}`, function(
                  err,
                  rows
                ) {
                  if (err) console.log(err);
                  console.log("Silindi: " + deleteSQL.sql);
                  console.log(deleteSQL.list);

                  axios
                    .post(`${storageKeys.url}/deletes/`, {
                      files: deleteSQL.list
                    })
                    .then(result => {
                      console.log(result.data);
                    });
                });
              } else {
                res({ finish: true, rows: sendingWorks });
              }
            }
          }
        );
      } else {
        await db.all(
          `SELECT name,username,description,work_area FROM users WHERE username != '${user.username}' ORDER BY random() LIMIT 10`,
          async function(err, rows) {
            if (err) console.log(err);
            console.log("No friend");
            res({ notFound: true, users: rows });
          }
        );
      }
    } else {
      res(user);
    }
  });
}

function deleteWork({ workId, username, password, token }) {
  return new Promise((res, rej) => {
    db.all(`SELECT * FROM works WHERE id = '${workId}'`, async function(
      err,
      rows
    ) {
      let work = rows[0];

      if (work != undefined) {
        const user = await userModel.getUser(
          username,
          password,
          "login",
          token
        );

        if (user.err == undefined) {
          if (user.username == JSON.parse(work.owner).username) {
            db.run(`DELETE FROM works WHERE id = ${workId}`, function(err) {
              if (err) console.log(err);

              res(workId, work.title, username);
            });
          } else {
            res({ err: "Buna yetkiniz yok" });
          }
        } else {
          res(user);
        }
      }
    });
  });
}

module.exports = {
  getWork,
  searchWork,
  createWork,
  doWork,
  getDashboard,
  deleteWork,
  comment
};
