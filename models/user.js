var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./sqbase");

const jwt = require("jsonwebtoken");
const secret_key = require("./secret");

const bcrypt = require("bcryptjs");

async function getUser(username, password, why, token) {
  if (token != undefined) {
    await jwt.verify(token, secret_key, function(err, decoded) {
      if (decoded != undefined) {
        username = decoded.username;
        password = decoded.password;
      }
    });
  }
  return new Promise(async (res, rej) => {
    var deleteSQL = "";
    var sendingWorks = [];
    db.all(
      why == "login"
        ? `SELECT * FROM users WHERE username = '${username}'`
        : why == "userpage"
        ? `SELECT name,description,role,teachers,friends,students,username,work_area FROM users WHERE username = '${username}'`
        : why == "getstudents"
        ? `SELECT name,role,username,description,work_area FROM users WHERE teachers LIKE '%"username":"${username}"%'`
        : null,
      function(err, rows) {
        if (err) console.log(err);

        if (why == "userpage") {
          if (rows[0] != undefined) {
            db.all(
              `SELECT id,type,owner,title,subtitle,makers,shared,finish,image,comments FROM works WHERE owner LIKE '%"username":"${username}"%'`,
              function(err, rows2) {
                rows2.forEach(work => {
                  var now = new Date();
                  var finish = new Date(work.finish);
                  if (finish <= now) {
                    deleteSQL +=
                      deleteSQL == ""
                        ? `id = '${work.id}'`
                        : ` OR id = '${work.id}'`;
                  } else {
                    work.makers =
                      work.makers == undefined
                        ? 0
                        : JSON.parse(`[${work.makers}]`).length;
                    sendingWorks.push(work);
                  }
                });
                if (err) console.log(err);
                res({ ...rows[0], works: sendingWorks });

                if (deleteSQL != "") {
                  db.all(`DELETE FROM works WHERE ${deleteSQL}`);
                }
              }
            );
          } else res({ err: "Kullanıcı adı hatalı" });
        } else if (
          why == "login" &&
          password != undefined &&
          rows[0] != undefined
        ) {
          if (token == undefined) {
            bcrypt.compare(password, rows[0].password, (err, validate) => {
              if (validate) {
                const newtoken = jwt.sign(
                  { username: rows[0].username, password: rows[0].password },
                  secret_key,
                  { expiresIn: "60d" }
                );

                res({ ...rows[0], token: newtoken });
              } else {
                res({ err: "Kullanıcı adı veya şifre hatalı" });
              }
            });
          } else {
            if (password == rows[0].password) {
              res({ ...rows[0], token });
            } else {
              res({ err: "Kullanıcı adı yada şifre hatalı" });
            }
          }
        } else if (why == "getstudents") {
          console.log(rows);
          res(rows);
        } else {
          res({ err: "Kullanıcı adı veya şifre hatalı" });
        }
      }
    );
  });
}

function searchUser(name) {
  return new Promise((res, rej) => {
    console.log("object");
    db.all(
      `SELECT name,role,username,description,work_area FROM users WHERE name LIKE '%${name}%'`,
      function(err, rows) {
        if (err) console.log(err);
        else
          db.all(
            `SELECT name,role,username,description,work_area FROM users WHERE username LIKE '%${name}%'`,
            function(err2, rows2) {
              if (err2) console.log(err2);

              res([...rows, ...rows2]);
            }
          );
      }
    );
  });
}

async function createUser(name, password, username) {
  return new Promise(async (res, rej) => {
    let user = await getUser(username, null, "userpage");
    console.log(user);
    if (username[4] != undefined && name[4] != undefined) {
      if (user.err != undefined) {
        bcrypt.hash(password, 9, (err, cryptopass) => {
          db.all(
            `INSERT INTO users(name,password,username, role) VALUES ('${name}', '${cryptopass}', '${username}', 'student')`,
            function(err, rows) {
              if (err) console.log(err);

              const newtoken = jwt.sign(
                { username: username, password: cryptopass },
                secret_key,
                { expiresIn: "60d" }
              );

              res({ name, password, username, token: newtoken });
            }
          );
        });
      } else {
        res({ err: "Bu isme sahip bir kullanıcı zaten var" });
      }
    } else {
      res({ err: "İsminiz ve kullanıcı adınız 5 harften kısa olamaz" });
    }
  });
}

function addUser(stateUsername, statePassword, targetUsername, token) {
  return new Promise(async (res, rej) => {
    let user = await getUser(stateUsername, statePassword, "login", token);

    if (user.username != targetUsername) {
      if (user.err == undefined) {
        let targetUser = await getUser(targetUsername, null, "userpage");

        let targetUserSlim = `{"name": "${targetUser.name}", ${
          targetUser.description != undefined
            ? `"description": "${targetUser.description}",`
            : ""
        } "role": "${targetUser.role}", "username": "${targetUser.username}" ${
          targetUser.work_area != undefined
            ? `,"work_area": "${targetUser.work_area}"`
            : ""
        }  }`;
        console.log(targetUserSlim);
        targetUser = JSON.parse(targetUserSlim);

        console.log(JSON.parse(targetUserSlim));
        // console.log(JSON.parse('{"id":"123"   ,"color": "red"}'))

        if (targetUser.err == undefined) {
          let addedFriends = JSON.parse(`[${user.friends}]`);
          let addedFriendsBool =
            addedFriends[0] != undefined
              ? addedFriends.find(friend => {
                  return friend.username == targetUser.username;
                })
              : undefined;

          let addedTeachers = JSON.parse(`[${user.teachers}]`);
          let addedTeachersBool =
            addedTeachers[0] != undefined
              ? addedTeachers.find(teacher => {
                  return teacher.username == targetUser.username;
                })
              : undefined;

          if (
            targetUser.err == undefined &&
            addedFriendsBool == undefined &&
            addedTeachersBool == undefined
          ) {
            if (targetUser.role == user.role) {
              //--------------------------------------------------  ÇAPULCU EKLERSİN --------------------------------------------------------
              let adduser =
                user.friends != undefined && user.friends != ""
                  ? user.friends + "," + JSON.stringify(targetUser)
                  : JSON.stringify(targetUser);

              let data = [adduser, user.username, user.password];
              let sql = `UPDATE users SET friends = ? WHERE username = ? AND password = ?`;

              db.run(sql, data, function(err) {
                if (err) {
                  return console.error(err.message);
                }

                console.log(`Row(s) updated: ${this.changes}`);

                res({ adduser, where: "friends" });
              });
            } else if (
              targetUser.role == "teacher" &&
              (user.role == "student" || user.role == "Çapulcu")
            ) {
              let adduser =
                user.teachers != undefined && user.teachers != ""
                  ? user.teachers + "," + JSON.stringify(targetUser)
                  : JSON.stringify(targetUser);

              console.log(adduser);

              let data = [adduser, user.username, user.password];
              let sql = `UPDATE users SET teachers = ? WHERE username = ? AND password = ?`;

              db.all(sql, data, function(err) {
                if (err) {
                  return console.error(err.message);
                }

                console.log(`Row(s) updated: ${this.changes}`);

                res({ adduser, where: "teachers" });
              });
            } else {
              res({
                err: "Öğretmen, öğrencilerini herhangi bir şekilde ekleyemez"
              });
            }
          } else {
            res({ err: "Aradığınız kullanıcı zaten sizde ekli" });
          }
        } else {
          res({ err: "Araddığınız kullanıcı bulunamadı" });
        }
      } else {
        res(user.err);
      }
    } else {
      res({ err: "Kendinizi ekleyemezsiniz" });
    }
  });
}

function removeUser(stateUsername, statePassword, targetUsername, token) {
  return new Promise(async (res, rej) => {
    let user = await getUser(stateUsername, statePassword, "login", token);

    console.log(user);
    let resObj = "";

    let addedFriends = [];
    let addedTeachers = [];

    if (user.err == undefined) {
      addedFriends = JSON.parse(`[${user.friends}]`);
      addedTeachers = JSON.parse(`[${user.teachers}]`);

      console.log(addedTeachers);
      console.log(targetUsername);

      let findFriend =
        addedFriends[0] != undefined
          ? addedFriends.find(friend => {
              return friend.username == targetUsername;
            })
          : undefined;

      let findTeacher =
        addedTeachers[0] != undefined
          ? addedTeachers.find(teacher => {
              return teacher.username == targetUsername;
            })
          : null;

      if (findFriend) {
        addedFriends.forEach(friend => {
          console.log(friend);
          if (friend.username != targetUsername)
            resObj +=
              resObj != ""
                ? `,${JSON.stringify(friend)}`
                : `${JSON.stringify(friend)}`;
        });
        console.log("object");

        db.all(
          "UPDATE users SET friends = (?) WHERE username = (?) AND password = (?)",
          [resObj, user.username, user.password],
          function(err, rows) {
            if (err) console.log(err);

            console.log("bures" + resObj);

            res({ where: "friends", rmuser: resObj });
          }
        );
      } else if (findTeacher) {
        addedTeachers.forEach(teacher => {
          console.log(teacher);
          if (teacher.username != targetUsername) {
            resObj +=
              resObj != ""
                ? `,${JSON.stringify(teacher)}`
                : `${JSON.stringify(teacher)}`;
          }
        });
        db.all(
          "UPDATE users SET teachers = ? WHERE username = ? AND password = ?",
          [resObj, user.username, user.password],
          function(err, rows) {
            if (err) console.log(err);

            res({ where: "teachers", rmuser: resObj });
          }
        );
      } else {
        res({ err: "Kullanıcı zaten sizde ekli değil" });
      }
    } else {
      res({ err: "Bir hata oluştu" });
    }
  });
}

module.exports = { getUser, searchUser, createUser, addUser, removeUser };
