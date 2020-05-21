<template>
    <div style="width:38%" class="mx-auto mt-56">
        <div class="flex w-48 mx-auto -mb-2">
            <button class="button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded h-10 mr-1" :class="!login ? 'opacity-25' : null" @click="login = false">Kayıt Ol</button>
            <button class="button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded h-10" :class="login ? 'opacity-25' : null" @click="login = true">Giriş Yap</button>
        </div>
        <div class="w-full">
          <input @keypress.enter="send" style="outline:none" type="text" v-model="username" class="block border-b-2 border-solid border-gray-500 w-full text-xl mt-6" placeholder="Kullanıcı Adı">
          <input @keypress.enter="send" style="outline:none" type="text" v-model="nameSurname" v-if="!login" class="block border-b-2 border-solid border-gray-500 w-full text-xl mt-5" placeholder="İsim/Soyisim">
          <input @keypress.enter="send" style="outline:none" type="password" v-model="password" class="block border-b-2 border-solid border-gray-500 w-full text-xl mt-5" placeholder="Şifre">
          <input @keypress.enter="send" style="outline:none" type="password" v-model="passwordReplace" v-if="!login" class="block border-b-2 border-solid border-gray-500 w-full text-xl mt-5" placeholder="Şifre tekrar">
        </div>
        <p v-if="loginError != undefined" v-text="loginError" class=" text-red-700 mt-1"></p>
     <button @click="send" class="button bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 rounded h-10 mr-1 w-full text-2xl mt-4"> Onayla </button>
    </div>
</template>

<script>
import Cookie from 'js-cookie'

export default {
    middleware: "auth",
    data(){
        return{
            login: false,
            username: null,
            password: null,
            nameSurname: null,
            passwordReplace: null,
            loginError: null
        }
    },
    methods: {
      send(){
        if(this.username != undefined && this.username != "" && this.password != undefined && this.password != ""){
        if(this.login){
        this.$axios.post("/api/getuser", { username: this.username, password: this.password, why:"login" })
          .then(result => {
            if(result.data.err == undefined){
               Cookie.set("token", result.data.token);
              window.location.href = "/";
            }
            else{
              this.loginError = result.data.err
            }
         })
        }
        else{
          if(this.nameSurname != undefined && this.nameSurname != "" && this.password == this.passwordReplace){
         this.$axios.post("/api/createuser", { name: this.nameSurname, password: this.password, username:this.username })
          .then(result => {
            if(result.data.err == undefined){
             Cookie.set("token", result.data.token);
              window.location.href = "/";
            }
            else{
              this.loginError = result.data.err
            }
         })
          }
          else{
            this.loginError = this.password == this.passwordReplace ? "Verilen alanları doldurunuz" : "Şifreler uyuşmuyor"
          }
        }
      }
      else{
        this.loginError = "Veilen alanları doldurunuz"
      }
      }
    }
}
</script>

<style>
.button {
    transition: background-color 0.2s, opacity 0.4s;
}

.dropel:hover {
  background-color: #b3b3b3;
}

.dropel:focus {
  background-color: #8f8f8f;
}

.form__group {
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 100%;
}
.form__field {
  width: 100%;
  font-family: inherit;
  border: 0;
  border-bottom: 2px solid #bbbbbb;
  outline: 0;
  font-size: 1rem;
  color: rgb(0, 0, 0);
  padding: 3px 0;
  background: transparent;
  transition: border-color 0.2s;
}
.form__field::placeholder {
  color: transparent;
}
.form__field:placeholder-shown ~ .form__label {
  font-size: 1rem;
  cursor: text;
  top: 20px;
}
.form__label {
  position: absolute;
  top: 10px;
  display: block;
  transition: 0.2s;
  font-size: 0.7rem;
  color: #9b9b9b;
}
.form__field:focus {
  padding-bottom: 6px;
  border-image: linear-gradient(to right, #238bbb, #47bccc);
  border-image-slice: 1;
}
.form__field:focus ~ .form__label {
  position: absolute;
  top: 5px;
  display: block;
  transition: 0.2s;
  font-size: 0.7rem;
  color: #1e87b8;
  font-weight: 700;
}

.searchbtn {
  transition: color 0.1s;
  color: #8f8f8f;
  font-size: 1.1rem;
}

.form__field:focus ~ .searchbtn {
  color: #238bbb;
}
/* reset input */
.form__field:required,
.form__field:invalid {
  box-shadow: none;
}
/* demo */

</style>