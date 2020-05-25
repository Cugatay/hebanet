<template>
  <div style="width:100vw">
    <div class="container md:w-3/4 w-full mx-auto">
      <div class="head flex justify-around items-center">
        <div class="user-avatar flex items-center">
          <div>
            <div
              style="background: rgb(202, 202, 202); padding-top:1.1rem; padding-bottom: 1.1rem;width:4.4rem"
              class="group rounded-full overflow-hidden shadow-inner text-center bg-purple table cursor-pointer"
            >
              <span
                v-if="nameSurname != undefined"
                class="group-hover:table-cell text-white font-bold align-middle text-2xl"
              >
                {{ nameSurname[0] + nameSurname[1] }}
              </span>
            </div>
          </div>
          <div class="block">
            <div class="text-2xl ml-2 cursor-pointer flex items-center">
              <p class="truncate" style="max-width:14rem">{{ nameSurname }}</p>
              <span class="uppercase text-xs text-gray-700 cursor-auto ml-2">{{
                workArea
              }}</span>
            </div>
            <p class="text-gray-500 text-lg">@{{ username }}</p>
          </div>
        </div>
        <FollowBtn
          :username="username"
          :isTeacher="workArea == undefined ? false : true"
        />
      </div>

      <div
        v-if="
          commonFriendsTeachers[0] != undefined &&
            $store.state.username != username
        "
        class="common-friends w-2/3 mx-auto mt-10 rounded-lg h-16 justify-start block"
      >
        <div class="header text-center mb-1 text-2xl">
          <hr style="margin-bottom:-1.3rem" />
          <p class="bg-white mx-auto" style="width:11.5rem">Ortak Arkadaşlar</p>
        </div>
        <div class="flex md:justify-start justify-center">
          <div style="width:4rem" class="mx-1">
            <!-- ------------------------------------------- -->
            <div>
              <div
                v-for="user in commonFriendsTeachers"
                :key="user.username"
                style="background: rgb(202, 202, 202); padding-top:1.2rem; padding-bottom: 1.2rem;width:4.2rem"
                class="group rounded-full overflow-hidden shadow-inner text-center bg-purple table cursor-pointer"
              >
                <span
                  class="group-hover:table-cell text-white font-bold align-middle text-xl"
                >
                  <!-- {{ name[0] + name[1] }} -->
                  {{ user.username[0] + user.username[1] }}
                </span>
              </div>
            </div>
            <!-- ------------------------------------------- -->
          </div>
        </div>
      </div>

      <div class="tunnel md:w-2/3 w-5/6 mx-auto mt-16">
        <div class="tunnel-header w-full">
          <div class="flex justify-around">
            <div class="ml-12 text-lg block">
              <p
                class="text-gray-600 cursor-pointer"
                :class="
                  !user_tunnelBool ? ' hover:text-gray-700 text-gray-800' : ''
                "
                @click="
                  personsBool = false;
                  user_tunnelBool = true;
                "
              >
                Kullanıcı Tüneli
              </p>
              <div
                v-if="user_tunnelBool"
                style="margin-left:0.8rem;border-radius: 10px 10px 0 0"
                class="w-24 h-2 bg-gray-500"
              ></div>
            </div>
            <div class="mr-12 text-lg block w-24">
              <p
                class="text-gray-600 cursor-pointer text-center"
                :class="
                  !personsBool ? ' hover:text-gray-700 text-gray-800' : ''
                "
                @click="
                  personsBool = true;
                  user_tunnelBool = false;
                "
              >
                Kişiler
              </p>
              <div
                v-if="personsBool"
                style="border-radius: 10px 10px 0 0"
                class="w-24 h-2 bg-gray-500"
              ></div>
            </div>
          </div>
          <hr />
        </div>
      </div>

      <div class="posts md:w-2/3 w-11/12 mx-auto mt-5 pl-6">
        <div v-if="user_tunnelBool">
          <Work
            class="mt-4"
            :where="'normal'"
            :done="true"
            v-for="work in works"
            :key="work.id"
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
          />
        </div>
        <div v-else-if="personsBool" class="ml-6 md:ml-0">
          <div v-if="teachers != undefined">
            <UserCard
              v-for="(teacher, value) in teachers"
              :key="teacher.username"
              class="float-left mb-2"
              :class="value % 2 == 0 ? 'mr-2' : ''"
              :username="teacher.username"
              :nameSurname="teacher.name"
              :workArea="teacher.work_area"
              :description="teacher.description"
            />
          </div>
          <div v-if="friends != undefined">
            <UserCard
              v-for="(friend, value) in friends"
              :key="friend.username"
              class="float-left mb-2"
              :class="
                value % 2 == 0 && value == 0 ? '' : value % 2 == 0 ? 'mr-2' : ''
              "
              :username="friend.username"
              :nameSurname="friend.name"
              :workArea="friend.work_area"
              :description="friend.description"
            />
          </div>
          <div
            v-if="teachers == undefined && friends == undefined"
            class="text-center w-11/12 text-gray-600"
            v-text="
              $store.state.username == username
                ? 'Daha hiç kimseyi eklemedin. Kullanıcıları aramaya ve eklemeye hemen başlayabilirsin!'
                : 'Bu kullanıcının arkadaşı ve öğretmeni yok'
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Work from "@/components/Work";
import UserCard from "@/components/UserCard";
import FollowBtn from "@/components/FollowBtn";
export default {
  components: {
    Work,
    UserCard,
    FollowBtn
  },
  data() {
    return {
      user_tunnelBool: true,
      personsBool: false,
      username: null,
      nameSurname: null,
      attachedPeople: [],
      posts: null,
      workArea: null,
      friends: null,
      teachers: null,
      description: null,
      commonFriendsTeachers: [],
      works: []
    };
  },
  methods: {},
  asyncData(context, callback) {
    console.log(context.route.params.username);
    context.$axios
      .post("/api/getuser", {
        username: context.route.params.username,
        password: "",
        why: "userpage"
      })
      .then(result => {
        console.log(result.data.works);
        callback(null, {
          nameSurname: result.data.name,
          username: result.data.username,
          workArea: result.data.work_area,
          friends:
            result.data.friends != undefined && result.data.teachers != ""
              ? JSON.parse(`[${result.data.friends}]`)
              : null,
          teachers:
            result.data.teachers != undefined && result.data.teachers != ""
              ? JSON.parse(`[${result.data.teachers}]`)
              : null,
          description: result.data.description,
          works: result.data.works
        });
      });
  },
  mounted() {
    if (this.username == undefined) {
      window.location = "/";
    }
    setTimeout(() => {
      console.log(this.commonFriendsTeachers);
    }, 2000);
    var thisTeachers = JSON.parse(`[${this.$store.state.teachers}]`);
    if (
      this.teachers != undefined &&
      this.teachers != "" &&
      thisTeachers != undefined &&
      thisTeachers != "" &&
      this.teachers[0] != undefined &&
      thisTeachers[0] != undefined
    ) {
      var commonTeachers = this.teachers.filter(teacher => {
        return thisTeachers.find(thisTeacher => {
          return thisTeacher.username == teacher.username;
        });
      });
      this.commonFriendsTeachers.push(...commonTeachers);
    }

    var thisFriends = JSON.parse(`[${this.$store.state.friends}]`);
    if (
      this.friends != undefined &&
      this.friends != "" &&
      thisFriends != undefined &&
      thisFriends != "" &&
      this.friends[0] != undefined &&
      thisFriends[0] != undefined
    ) {
      var commonFriends = this.friends.filter(friend => {
        return thisFriends.find(thisFriend => {
          return thisFriend.username == friend.username;
        });
      });
      this.commonFriendsTeachers.push(...commonFriends);
    }
  }
};
</script>
