<template>
            <div>
          <button v-if="$store.state.work_area != undefined && isTeacher == true || $store.state.work_area == undefined" ref="userButton" @click="userBtnMethod" class="userMethod px-3 py-1 rounded text-gray-100 cursor-pointer text-md transition-colors duration-300" style="background-color: rgba(66, 153, 225,0.9);outline:none"> {{ $store.state.username == username ? 'Çıkış Yap' : this.friendBool == undefined && (this.isTeacher == false || this.isTeacher == true && $store.state.work_area != undefined) ? 'Arkadaş Ekle' : this.teacherBool == undefined && this.isTeacher && $store.state.work_area == undefined ? 'Öğretmeni Ekle' : this.isTeacher && $store.state.work_area == undefined ? 'Takibi Bırak' : 'Arkadaşlıktan Çık' }} </button>
            </div>
</template>

<script>
import Cookie from 'js-cookie';

export default {
    props: {
        username: {
            required: true,
            type: String
        },
        isTeacher: {
            required: true,
            type: Boolean
        }
    },
    data(){
        console.log('--------------------------------')
        console.log(this.$store.state.friends)
        console.log(this.$store.state.teachers)
        console.log('--------------------------------')

    const friendBool = this.$store.state.friends != undefined ? JSON.parse(`[${this.$store.state.friends}]`).find((friend) => {
    return friend.username == this.username;
    }) : undefined;
    const teacherBool = this.$store.state.teachers != undefined ? JSON.parse(`[${this.$store.state.teachers}]`).find((teacher) => {
    return teacher.username == this.username;
    }) : undefined;
        return{
            friendBool,
            teacherBool,
        }
    },
    methods: {
    userBtnMethod(){
        console.log(this.username)
        this.$refs.userButton.style.background = "rgba(80, 170, 240,0.7)";

      if(this.$store.state.username == this.username){
        Cookie.remove("token");
        window.location = "/login";
      }
      else{
          if(Cookie.get('token') != undefined){
            
              if(this.friendBool == undefined && this.teacherBool == undefined){
      this.$axios.post("/api/adduser", { username:'null', password:'null', targetUsername:this.username, token:Cookie.get('token') })
      .then(result => {
        console.log(result.data)
        if(result.data.err == undefined){
        this.teacherBool = ""
        this.friendBool = ""
        this.$refs.userButton.style.background = "rgba(66, 153, 225,0.9)";
        this.$store.commit("changeAddeds", result.data)
        }
        else{
        this.$refs.userButton.style.background = "rgba(66, 153, 225,0.9)";
        this.$store.commit("changeAddeds", result.data)
            console.log(result.data.err)
        }
      })
           }
           else{
            //    console.log({ err: "Aradığınız kullanıcı zaten sizde ekli ve bu hatayı kendi elimle yazıyorum" })
      this.$axios.post("/api/removeuser", { username:"null", password:'null', targetUsername:this.username, token: Cookie.get('token') })
      .then(result => {
        console.log(result.data)
        if(result.data.err == undefined){
        this.teacherBool = null
        this.friendBool = null
        this.$refs.userButton.style.background = "rgba(66, 153, 225,0.9)";
        console.log("asdasdaaddadasdsad")
        console.log(result.data)
        this.$store.commit("changeAddeds", result.data)
        }
        else{
        this.$refs.userButton.style.background = "rgba(66, 153, 225,0.9)";
        this.$store.commit("changeAddeds", result.data)
            console.log(result.data.err)
        }
      })
           }
      }
      else{
          window.location = "/login"
      }
      }
    }
    },
    mounted(){
    console.log('mountedddddddddddddddd')
        console.log(this.username)
    }
}
</script>