<template>
  <div class=" overflow-hidden">
    <WorkUI v-if="$store.state.workUI" class="fixed top-0 left-0 z-50" />
    <div
      v-if="$store.state.works != undefined"
      class="mx-auto min-h-full w-full"
    >
      <div
        v-if="$store.state.works[0] == undefined"
        class="text-center text-gray-600"
      >
        Yeni bir ödev, soru veya anket yok
      </div>
      <div
        v-if="$store.state.works.length > 3"
        class="w-full md:mb-12 mb-6 scroll ml-2 md:ml-0"
        style="overflow:auto"
      >
        <div class="mx-auto Works w-80 mb-2 mt-4 flex">
          <Work
            :where="'deadline'"
            :id="$store.state.works[0].id"
            :owner="$store.state.works[0].owner"
            :title="$store.state.works[0].title"
            :type="$store.state.works[0].type"
            :subtitle="$store.state.works[0].subtitle"
            :makers="$store.state.works[0].makers"
            :shared="$store.state.works[0].shared"
            :finish="$store.state.works[0].finish"
            :image="$store.state.works[0].image"
            :comments="$store.state.works[0].comments"
            :answers="JSON.parse($store.state.works[0].answers)"
          />
          <Work
            :where="'deadline'"
            :id="$store.state.works[1].id"
            :owner="$store.state.works[1].owner"
            :title="$store.state.works[1].title"
            :type="$store.state.works[1].type"
            :subtitle="$store.state.works[1].subtitle"
            :makers="$store.state.works[1].makers"
            :shared="$store.state.works[1].shared"
            :finish="$store.state.works[1].finish"
            :image="$store.state.works[1].image"
            :comments="$store.state.works[1].comments"
            :answers="JSON.parse($store.state.works[0].answers)"
          />
          <Work
            :where="'deadline'"
            :id="$store.state.works[2].id"
            :owner="$store.state.works[2].owner"
            :title="$store.state.works[2].title"
            :type="$store.state.works[2].type"
            :subtitle="$store.state.works[2].subtitle"
            :makers="$store.state.works[2].makers"
            :shared="$store.state.works[2].shared"
            :finish="$store.state.works[2].finish"
            :image="$store.state.works[2].image"
            :comments="$store.state.works[2].comments"
            :answers="JSON.parse($store.state.works[0].answers)"
          />
          <p></p>
        </div>
      </div>
      <div class="homeworks justify-center mx-auto w-11/12 md:w-55">
        <!-- md:w-8/12 or w-55 -->
        <work
          v-for="(work, value) in $store.state.works"
          v-if="!($store.state.works.length > 3 && value <= 2)"
          :key="work.id"
          :where="'normal'"
          :id="work.id"
          :owner="work.owner"
          :title="work.title"
          :type="work.type"
          :subtitle="work.subtitle"
          :makers="work.makers"
          :shared="work.shared"
          :finish="work.finish"
          :image="work.image"
          :comments="work.comments"
          :answers="JSON.parse(work.answers)"
        />
      </div>
      <div
        v-if="!$store.state.finish"
        class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-10 w-10 mx-auto"
      ></div>
    </div>
    <div v-else-if="$store.state.suggestUsers != undefined">
      <div class="text-center text-gray-600">
        Hiç arkadaşın veya öğretmenin yok
      </div>
      <div class="text-center text-gray-600">
        Fakat durma, yukarıdan arkadaşlarını ve öğretmenlerini arayabilir
      </div>
      <div class="text-center text-gray-600">
        Veya aşağıda önerilen kullanıcılara bakabilirsin
      </div>
      <div class="suggest-users h-64 mx-auto mt-1" style="width:82.5rem">
        <UserCard
          v-for="user in suggestUsers"
          :key="user.username"
          class="float-left ml-2 mt-3"
          :username="user.username"
          :nameSurname="user.name"
          :workArea="user.work_area"
          :description="user.description"
        />
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      Yeni bir ödev, soru veya anket yok
    </div>
    <!-- <div>
      <button @click="doWork">asd</button>
    </div> -->
  </div>
</template>

<script>
import debounce from "lodash/debounce";

import Work from "@/components/Work";
import Header from "@/components/Header";
import UserCard from "@/components/UserCard";
import WorkUI from "@/components/WorkUI";

export default {
  components: {
    Work,
    Header,
    UserCard,
    WorkUI
  },
  data() {
    return {
      scroll: null,
      suggestUsers: this.$store.state.suggestUsers
    };
  },
  methods: {
    comment() {
      this.$axios
        .post("/api/comment", {
          token: this.$store.state.token,
          workId: "Ar7Dfu6FFI",
          commentary: "selamlar"
        })
        .then(result => {
          console.log(result.data);
        });
    },
    getDashboard() {
      this.$axios
        .post("/api/getdashboard", { token: this.$store.state.token })
        .then(result => {
          console.log(result.data);
        });
    },
    getWork() {
      this.$axios
        .post("/api/getwork", {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNhZ2F0YXl4eCIsInBhc3N3b3JkIjoiJDJhJDA5JGw5WHNtVlBOWXlmUm1Tb3BpajhyRXVhSmw4WXhtWGZmQ2ZiVDlRbDlQeUxJMUxYMGxMLlBHIiwiaWF0IjoxNTg4OTA4MDk1LCJleHAiOjE1OTQwOTIwOTV9.lAm9B7IOA6IzDodYS9KpnOsClDXwmWqqI-jCZhXswhU",
          workId: "99Vm1PcBVD"
        })
        .then(result => {
          console.log(result.data);
        });
    },
    doWork() {
      this.$axios
        .post("/api/dowork", {
          token: this.$store.state.token,
          workId: "",
          answers: ["b"]
        })
        .then(result => {
          console.log(result.data);
        });
    },
    getuser() {
      this.$axios
        .post("/api/getuser", {
          username: "denebana",
          password: "123456",
          why: "userpage"
        })
        .then(result => {
          console.log(result.data);
        });
    },
    searchuser() {
      this.$axios.post("/api/searchuser", { name: "atay" }).then(result => {
        console.log(result.data);
      });
    },
    createUser() {
      this.$axios
        .post("/api/createuser", {
          name: "Çağatay Kaydır",
          password: "1234567890",
          username: "cagoxum"
        })
        .then(result => {
          console.log(result.data);
        });
    },
    addUser() {
      this.$axios
        .post("/api/adduser", {
          username: "hoca",
          password: "hoca",
          targetUsername: "sebo"
        })
        .then(result => {
          console.log(result.data);
        });
    },
    removeUser() {
      this.$axios
        .post("/api/removeuser", {
          username: "şebelekko",
          password: "null",
          targetUsername: "denebana",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNhZ2F0YXl4eCIsInBhc3N3b3JkIjoiJDJhJDA5JGw5WHNtVlBOWXlmUm1Tb3BpajhyRXVhSmw4WXhtWGZmQ2ZiVDlRbDlQeUxJMUxYMGxMLlBHIiwiaWF0IjoxNTg4OTA4MDk1LCJleHAiOjE1OTQwOTIwOTV9.lAm9B7IOA6IzDodYS9KpnOsClDXwmWqqI-jCZhXswhU"
        })
        .then(result => {
          console.log(result.data);
        });
    },
    handleScroll(event) {
      // Any code to be executed when the window is scrolled
      this.isUserScrolling = window.scrollY > 0;
      var body = document.body,
        html = document.documentElement;

      var documentHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      var maxScroll = documentHeight - window.innerHeight;

      if (maxScroll == window.scrollY) {
        if (!this.$store.state.finish) {
          this.$axios
            .post("/api/getdashboard", {
              token: this.$store.state.token,
              notequals: this.$store.state.notequals
            })
            .then(result => {
              console.log(result.data);
              this.$store.commit("addWorks", result.data);
            });
        }
      }
    }
  },
  mounted() {
    console.log(this.$store.state.notequals);
    this.suggestUsers = this.$store.state.suggestUsers;
    this.handleDebouncedScroll = debounce(this.handleScroll, 100);
    window.addEventListener("scroll", this.handleDebouncedScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleDebouncedScroll);
  }
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  width: 100vw;
}

.scroll::-webkit-scrollbar {
  width: 1px;
  height: 9px;
}

/* Track */
/*.scroll::-webkit-scrollbar-track {
}*/

/* Handle */
.scroll::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 8px;
  margin-top: 1rem;
}

/* Handle on hover */
.scroll::-webkit-scrollbar-thumb:hover {
  background: rgb(110, 110, 110);
}

.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
