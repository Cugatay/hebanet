import Vuex from "vuex";
import Cookie from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null,
      username: null,
      name: null,
      work_area: null,
      friends: null,
      teachers: null,
      storage: "http://heba-storage.herokuapp.com",
      // storage: "http://localhost:4000",
      works: null,
      notequals: [],
      suggestUsers: null,
      workUI: false,
      workUIDetails: {},
      finish: false
    },
    mutations: {
      setToken(state, token) {
        Cookie.set("token", token);
        state.token = token;
      },

      clearToken(state) {
        Cookie.remove("token");
        state.token = null;
      },

      setUser(state, user) {
        state.name = user.name;
        state.username = user.username;
        state.work_area = user.work_area;
        state.friends = user.friends;
        state.teachers = user.teachers;
      },

      changeAddeds(state, user) {
        if (user != undefined) {
          if (user.where == "friends") {
            if (user.adduser != undefined) state.friends = user.adduser;
            else if (user.rmuser != undefined) state.friends = user.rmuser;
          } else if (user.where == "teachers") {
            console.log("teachers");
            if (user.adduser != undefined) state.teachers = user.adduser;
            else if (user.rmuser != undefined) state.teachers = user.rmuser;
          }
        }
      },

      addWorks(state, data) {
        if (state.works != undefined) {
          state.works = [...state.works, ...data.rows];
          data.rows.forEach(work => {
            state.notequals.push(work.id);
          });
          if (data.finish) {
            state.finish = true;
          }
        } else {
          state.works = data;
        }
      },

      setWorkUI(state, workParams) {
        state.workUIDetails = workParams;
        state.workUI = true;
      },

      closeWorkUI(state) {
        state.workUI = false;
      },

      addComment(state, commentInfo) {
        console.log(commentInfo);
        const id = commentInfo.id;
        if (id != undefined && commentInfo.comment != undefined) {
          state.works.forEach((work, value) => {
            if (work.id == id) {
              state.works[value].comments =
                state.works[value].comments == "" ||
                state.works[value].comments == undefined
                  ? JSON.stringify(commentInfo)
                  : `${state.works[value].comments}, ${JSON.stringify(
                      commentInfo
                    )}`;
            }
          });
        }
      }
    },
    actions: {
      async nuxtServerInit(vuexContext, context) {
        if (context.req.headers.cookie != undefined) {
          let token = context.req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("token="));
          if (token != undefined) {
            token = token.split("=")[1];

            // console.log(vuexContext.state.works)
            if (
              vuexContext.state.works == undefined &&
              vuexContext.state.suggestUsers == undefined
            ) {
              await context.$axios
                .post("/api/getdashboard", { token })
                .then(result => {
                  console.log(
                    "autttttttttthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
                  );
                  console.log(result.data.rows);
                  if (result.data.notFound == true) {
                    console.log("Çuruğ");
                    vuexContext.state.suggestUsers = result.data.users;
                  } else {
                    // console.log(object)
                    if (
                      result.data.rows != undefined &&
                      result.data.rows[0] != undefined
                    ) {
                      result.data.rows.sort(function(a, b) {
                        var Afinish = new Date(a.finish);
                        var Bfinish = new Date(b.finish);

                        if (Afinish > Bfinish) {
                          return 1;
                        }
                        if (Bfinish > Afinish) {
                          return -1;
                        }
                        return 0;
                      });
                      vuexContext.state.works = result.data.rows;

                      result.data.rows.forEach(work => {
                        vuexContext.state.notequals.push(work.id);
                      });
                    }
                  }
                  if (result.data.finish == true) {
                    vuexContext.state.finish = true;
                  }
                });
            }
            vuexContext.state.token = token;
          }
        }
      }
    },
    getters: {
      isAuth(state) {
        return state.token !== null;
      }
    }
  });
};

export default createStore;
