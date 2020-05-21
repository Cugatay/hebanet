import Vuex from 'vuex'
import Cookie from 'js-cookie'

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
            works: null,
            suggestUsers: null
        },
        mutations: {
            setToken(state, token){
                Cookie.set("token", token);
                state.token = token;
            },

            clearToken(state){
                Cookie.remove("token");
                state.token = null;
            },

            setUser(state, user){
                state.name = user.name;
                state.username = user.username;
                state.work_area = user.work_area;
                state.friends = user.friends;
                state.teachers = user.teachers;
            },

            changeAddeds(state, user){
                if(user != undefined){
                    if(user.where == "friends"){
                        if(user.adduser != undefined)
                        state.friends = user.adduser
                        else if(user.rmuser != undefined)
                        state.friends = user.rmuser
                    }
                    else if(user.where == "teachers"){
                        console.log("teachers")
                        if(user.adduser != undefined)
                        state.teachers = user.adduser
                        else if(user.rmuser != undefined)
                        state.teachers = user.rmuser
                    }
                }
            },

            addWorks(state, works){
                state.works = [...state.works, ...works]
            }
        },
        actions: {
            async nuxtServerInit(vuexContext, context){
                if(context.req.headers.cookie != undefined){
                let token = context.req.headers.cookie.split(";").find(c => c.trim().startsWith("token="))
                if(token != undefined){
                    token = token.split("=")[1]
                
                    // console.log(vuexContext.state.works)
                    if(context.req.url == "/" && vuexContext.state.works == undefined){
                        await context.$axios.post("/api/getdashboard", { token })
                        .then(result => {
                            
                            console.log('autttttttttthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
                            
                          console.log(result.data.users)
                          if(result.data.notFound == true){
                              console.log('Çuruğ')
                            vuexContext.state.suggestUsers = result.data.users
                          }
                          else{
                              vuexContext.state.works = result.data.rows;
                          }
                          console.log('--------------+++++++++++++------------------')
                          console.log(result.data)
                          console.log('--------------+++++++++++++------------------')
                        })
                        console.log('-------------------------------------')
                        console.log(vuexContext.state.works)
                        console.log('-------------------------------------')
                    }
                    vuexContext.state.token = token;
                }

            }
            }
        },
        getters: {
            isAuth(state){
                return state.token !== null;
            }
        }
    })
}

export default createStore