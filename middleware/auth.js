export default async function(context){
  console.log('auth')
  if(context.store != undefined && context.req != undefined){
  let token = context.store.state.token
    
    if(token == undefined){
        context.redirect("/login")
    }
    else{
       var getToken = await new Promise(async(res, rej) => {
         await context.$axios.post("/api/getuser", { username: null, password: null ,why:"login", token })
        .then(result => {
          res(result.data)
        })
       })
       if(getToken.err != undefined){
         context.redirect("/login")
       }
       else{
         context.store.commit("setUser", {username: getToken.username, name: getToken.name, work_area: getToken.work_area, friends: getToken.friends, teachers: getToken.teachers})
       }
    }
  }
  }