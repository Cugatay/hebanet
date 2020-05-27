<template>
  <div class="container w-full mx-auto">
    <div v-if="teachers != undefined" class="teachers">
      <div class="header mx-auto md:w-10/12 w-full text-left mb-1 text-2xl">
        <hr style="margin-bottom:-1.3rem" />
        <p class="bg-white pl-1 ml-4" style="width:8.85rem">Öğretmenler</p>
      </div>

      <div
        class="scroll teacher_cards mx-auto mt-4 mb-10 flex overflow-x-scroll w-11/12 pb-3"
      >
        <div style="width:20000vw" class="flex">
          <UserCard
            v-for="teacher in teachers"
            :key="teacher.username"
            class="float-left ml-2"
            :username="teacher.username"
            :nameSurname="teacher.name"
            :workArea="teacher.work_area"
            :description="teacher.description"
          />
        </div>
      </div>
    </div>

    <div v-if="students != undefined" class="students">
      <div class="header mx-auto md:w-10/12 w-full text-left mb-1 text-2xl">
        <hr style="margin-bottom:-1.3rem" />
        <p class="bg-white pl-1 ml-4" style="width:7.5rem">Öğrenciler</p>
      </div>
      <div
        class="scroll student_cards mx-auto mt-4 mb-10 flex overflow-x-auto w-11/12 pb-3"
      >
        <div style="width:20000vw" class="flex">
          <UserCard
            v-for="student in students"
            :key="student.username"
            class="float-left ml-2"
            :username="student.username"
            :nameSurname="student.name"
            :workArea="student.work_area"
            :description="student.description"
          />
        </div>
      </div>
    </div>

    <div class="header mx-auto md:w-10/12 w-full text-left mb-1 text-2xl">
      <hr style="margin-bottom:-1.3rem" />
      <p class="bg-white pl-1 ml-4" style="width:5.7rem">Ödevler</p>
    </div>

    <div class="posts md:w-2/3 w-11/12 mx-auto mt-5">
      <!-- <Work class="mt-4" :where="'normal'" />
          <Work class="mt-4" :where="'normal'" />
          <Work class="mt-4" :where="'normal'" /> -->
    </div>
  </div>
</template>

<script>
import UserCard from "@/components/UserCard";
import Work from "@/components/Work";

export default {
  components: {
    UserCard,
    Work
  },
  data() {
    return {
      teachers: null,
      students: null
    };
  },
  asyncData(context, callback) {
    context.$axios
      .post("/api/searchuser", {
        name: context.route.params.search_param,
        password: "",
        why: "userpage"
      })
      .then(result => {
        console.log(result.data);
        let students = [];
        let teachers = [];

        if (result.data.length != 0 && result.data[0].err == undefined) {
          result.data.forEach(user => {
            if (user.role == "student") {
              const userBool = students.find(bool => {
                return bool.username == user.username;
              });
              if (userBool == undefined) {
                students.push(user);
              }
            } else if (user.role == "teacher") {
              const userBool = teachers.find(bool => {
                return bool.username == user.username;
              });

              if (userBool == undefined) {
                teachers.push(user);
              }
            }
          });

          callback(null, {
            students: students[0] != undefined ? students : null,
            teachers: teachers[0] != undefined ? teachers : null
          });
        } else {
          console.log("olmadı");
          callback(null, {});
        }
      });
  }
};
</script>

<style>
.scroll::-webkit-scrollbar {
  width: 1px;
  height: 8px;
}

/* Track */
/*.scroll::-webkit-scrollbar-track {
}*/

/* Handle */
.scroll::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 8px;
}

/* Handle on hover */
.scroll::-webkit-scrollbar-thumb:hover {
  background: transparent;
}
</style>
