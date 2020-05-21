<template>
  <div
    class="w-full h-13 fixed top-0 bg-white shadow-header flex justify-between items-center"
  >
    <div class="left">
      <nuxt-link to="/">
        <span class=" text-3xl pl-3">Heba</span>
      </nuxt-link>
    </div>
    <div class="center focus:bg-blue-500 -mt-5 w-1/3">
      <div
        v-if="
          searchDropdown == true
        "
        class="fixed top-0 w-1/3"
        style=""
      >
        <div
          id="searchDropdownDiv"
          class="w-64 bg-white shadow-header mx-auto mt-12 h-64 overflow-y-auto overflow-x-hidden rounded-md"
        >
          <div
            class="students mb-2 mt-1"
            v-if="students.length != 0"
          >
            <div class="searchRes text-xl text-center">Öğrenciler</div>
            <nuxt-link class="searchRes" v-for="result in students" :key="result.username" :to="'/user/' + result.username">
            <div
              class="w-full h-12 items-center flex px-1 mt-1 cursor-pointer transition-colors duration-300 hover:bg-gray-200"
              style="padding-top:0.5rem;padding-bottom:0.5rem"
            >
              <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                style="width:2.8rem; height:2.8rem"
                class="rounded-full cursor-pointer"
              />
              <div class="block ml-1">
                <p class="text-lg -mb-2 truncate w-48">{{ result.name }}</p>
                <p class=" text-gray-500 text-sm -mt-2 -ml-1 w-36 truncate">
                  @{{ result.username }}
                </p>
              </div>
            </div>
            </nuxt-link>
          </div>

          <div
            class="teachers mt-1"
            v-if="teachers.length != 0"
          >
            <div class="text-xl text-center">Öğretmenler</div>
            <nuxt-link class="teacherRes" v-for="result in teachers" :key="result.username" :to="'/user/' + result.username">
            <div
              class="searchRes w-full h-12 items-center flex px-1 mt-1 cursor-pointer transition-colors duration-300 hover:bg-gray-200"
              style="padding-top:0.5rem;padding-bottom:0.5rem"
            >
              <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                style="width:2.8rem; height:2.8rem"
                class="rounded-full cursor-pointer"
              />
              <div class="block ml-1">
                <p class="text-lg -mb-2 truncate w-48">{{ result.name }}</p>
                <p class=" text-gray-500 text-sm -mt-2 -ml-1 w-36 truncate">
                  @{{ result.username }}
                </p>
              </div>
            </div>
            </nuxt-link>
          </div>

          <div v-if="students.length == 0 && teachers.length == 0" class="not_found text-center mt-2 text-gray-500">
            Sonuç bulunamadı. Özel karakterleri büyük/küçük yazmayı deneyin
          </div>

            <div
            v-else
              class="w-full h-12 items-center flex px-1 mt-1 cursor-pointer transition-colors duration-300 bg-gray-100 hover:bg-gray-200"
            > 
            <nuxt-link :to="'/search/' + searchStr">
              <p class="text-xl text-gray-600 px-1"><span class="font-bold">#{{searchStr}}</span> için daha fazlası</p>
            </nuxt-link>
            </div>

        </div>
      </div>

      <div class="form__group field flex ">
        <input
          autocomplete="off"
          @keypress.enter="searchMethod"
          v-model="searchStr"
          type="input"
          class="form__field -mr-6 select-none"
          placeholder="Name"
          name="name"
          id="name"
          required
        />
        <label for="name" class="form__label">Öğretmen, öğrenci, ödev..</label>

        <div
          @click="searchMethod"
          id="searchIc"
          style="transition: opacity 0.2s;"
        >
            <img src="/icons/search.svg" style="width:1.4rem" class="searchbtn cursor-pointer">
        </div>
      </div>
    </div>
    <div class="right flex">
            <img 
            id="addDropdown"
            @click="
          addDropdown == true
            ? setDropdown('close', 'add')
            : setDropdown('open', 'add')
        "
             src="/icons/plus-circle.svg" class="cursor-pointer" style="width:1.8rem;color:#8f8f8f; transition: color 0.3s;">
      <div class="pr-2 w-14 h-12 ml-3">
        <img
          id="userDropdown"
          @click="
            userDropdown == true
              ? setDropdown('close', 'user')
              : setDropdown('open', 'user')
          "
          src="https://cdn.vuetifyjs.com/images/john.jpg"
          class="w-full h-full rounded-full cursor-pointer"
          alt=""
        />
        <div
          id="userDropdownDiv"
          v-if="userDropdown"
          style="width:19rem;height:30rem"
          class="rounded-sm pt-1 opacity-0 transition-opacity duration-300 bg-white absolute right-0 mt-1 shadow-header"
        >
          <div class="user-infos flex h-16 items-center p-2">
            <nuxt-link :to="'/user/' + $store.state.username" class="flex items-center">
            <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              class="w-14 h-14 rounded-full cursor-pointer"
            />
            <div>
            <p class="text-2xl font-medium ml-1 truncate" style="max-width:10rem">
              {{ $store.state.username }}
            </p>
            </div>
            </nuxt-link>
            <span class="uppercase text-xs ml-2">
              {{ $store.state.work_area }}
            </span>
          </div>

          <nuxt-link to="/members">
          <div
            class="dropel text-lg font-medium cursor-pointer w-full transition-colors duration-300 mx-auto py-2 text-center"
          >
            {{
              $store.state.work_area == undefined
                ? "Öğretmenlerim"
                : "Öğrencilerim"
            }}
          </div>
          </nuxt-link>
          <nuxt-link to="/friends">
          <div
            class="dropel text-lg font-medium cursor-pointer w-full mx-auto py-2 duration-300 text-center"
          >
            Arkadaşlarım
          </div>
          </nuxt-link>
          <div
            class="dropel text-lg font-medium cursor-pointer w-full mx-auto py-2 duration-300 text-center"
          >
            {{
              $store.state.work_area == undefined
                ? "Ödevlerim"
                : "Verdiğim Ödevler"
            }}
          </div>
        </div>
        <div
          id="addDropdownDiv"
          v-if="addDropdown"
          class="rounded-sm opacity-0 transition-opacity duration-300 w-32 h-32 bg-white absolute right-0 mt-1 mr-4 shadow-header"
        >
          <div class="dropel text-lg cursor-pointer w-full mx-auto py-2 duration-300 text-center">
            Soru/Cevap
          </div>
        
          <div class="dropel text-lg cursor-pointer w-full mx-auto py-2 duration-300 text-center">
            Ödev
          </div>
 
          <div class="dropel text-lg cursor-pointer w-full mx-auto py-2 duration-300 text-center">
            Anket
          </div>
 
 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userDropdown: false,
      addDropdown: false,
      searchDropdown: false,
      searchStr: null,
      students: [],
      teachers: [],
      image: null
    };
  },
  methods: {
    updown() {
      document.getElementById("searchIc").style.opacity = "0.1";
      setTimeout(() => {
        document.getElementById("searchIc").style.opacity = "1";
      }, 200);
    },
    searchMethod() {
      if (this.searchStr != "" && this.searchStr != undefined) {
        this.students = [];
        this.teachers = [];

        this.$axios
          .post("/api/searchuser", { name: this.searchStr })
          .then(result => {
            console.log(result.data);
            this.updown();
            this.searchDropdown = true;

            result.data.forEach(user => {
              if (user.role == "student") {
                const userBool = this.students.find((bool) => {
                  return bool.username == user.username;
               });
                if(userBool == undefined){
                this.students.push(user);
                }

              } else if(user.role == "teacher") {
                const userBool = this.teachers.find((bool) => {
                  return bool.username == user.username;
               });

                if(userBool == undefined){
                this.teachers.push(user);
                }
              }
            });
          });
      }

      console.log("------------------------")
      console.log(this.students.length);
      console.log(this.teachers.length);
      console.log("------------------------")
    },
    setDropdown(func, who) {
      if (func == "close") {
        if (
          who == "user" ? this.userDropdown != false : this.addDropdown != false
        ) {
          document.getElementById(
            who == "user" ? "userDropdownDiv" : "addDropdownDiv"
          ).style.opacity = "0";
          setTimeout(() => {
        who == "user" ? (this.userDropdown = false) : (this.addDropdown = false);
          }, 300);
        }
      } else {
        who == "user" ? (this.userDropdown = true) : (this.addDropdown = true);
        setTimeout(() => {
          document.getElementById(
            who == "user" ? "userDropdownDiv" : "addDropdownDiv"
          ).style.opacity = "1";
        }, 10);
      }
    },
    deneme() {
      console.log("başarılı");
    }
  },
  mounted() {

    console.log(this.$store.state.work_area)
    window.addEventListener("click", e => {
      if (
        e.target == document.getElementById("name") ||
        e.target == document.getElementById("searchDropdownDiv") ||
        e.target.classList[0] == "searchRes"
      ) {
        if (this.searchStr != "" && this.searchStr != undefined)
          this.searchDropdown = true;
      } else {
        this.searchDropdown = false;
      }

      var iflahsiz = document
        .getElementById("addDropdown")

      if (
        e.target != document.getElementById("userDropdown") &&
        e.target != iflahsiz
      ) {
        this.setDropdown("close", "user");
        this.setDropdown("close", "add");
      }
    });
  },
  watch: {
    searchStr() {
      this.searchDropdown = false;
    },
    addDropdown(){
      console.log('asdadsadd')
      if(this.addDropdown == true){
        this.setDropdown("close", "user")
      }
    },
    userDropdown(){
      if(this.userDropdown == true){
        this.setDropdown("close", "add")
      }
    }
  }
};
</script>

<style>
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
