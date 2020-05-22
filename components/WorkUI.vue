<template>
  <div
    ref="workUI"
    style="opacity: 0;transition: opacity 0.35s"
    class="w-full h-full"
  >
    <div @click="closeUI" class="workUiBG w-full h-full" />

    <div class="workUI bg-white absolute top-0 mx-auto flex">
      <div class=" w-4/6 block p-6 pt-4">
        <div class="header flex items-center">
          <p class="text-3xl w-10/12">
            {{ $store.state.workUIDetails.title }}
          </p>
          <button
            class="button select-none bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-bold py-1 px-2 rounded-full"
            style="min-width:8.5rem; outline: none"
          >
            Yapmaya Başla
          </button>
        </div>
        <p class="text-lg">
          {{ $store.state.workUIDetails.title }}
        </p>
      </div>
      <div class="w-2/6 border-solid border-l-2 border-gray-200 block">
        <div
          class="w-full overflow-y-auto overflow-x-hidden"
          style="height:91%"
        >
          <div
            class="author items-center absolute bg-white mx-auto"
            style="width:31%"
          >
            <div class="flex mb-1 p-1 pb-0">
              <div>
                <div
                  style="background: rgb(202, 202, 202); padding-top:0.65rem; padding-bottom: 0.65rem;width:3.2rem"
                  class="group rounded-full overflow-hidden shadow-inner text-center bg-purple table cursor-pointer"
                >
                  <span
                    class="group-hover:table-cell text-white font-bold align-middle text-xl"
                  >
                    {{
                      JSON.parse($store.state.workUIDetails.owner).name[0] +
                        JSON.parse($store.state.workUIDetails.owner).name[1]
                    }}
                  </span>
                </div>
              </div>
              <div class="name ml-1">
                <p class="text-xl">
                  {{ JSON.parse($store.state.workUIDetails.owner).name }}
                </p>
                <p
                  class="text-gray-600 font-sm -ml-1"
                  style="margin-top:-0.3rem"
                >
                  @{{ JSON.parse($store.state.workUIDetails.owner).username }}
                </p>
              </div>
            </div>
            <hr />
          </div>

          <div class="comments mt-14">
            <p
              class="text-center text-gray-600 mt-2"
              v-if="
                (comments == undefined || comments == '') &&
                  (newComments == undefined || newComments == '')
              "
            >
              Henüz Yorum Yapılmadı
            </p>
            <div v-else>
              <Comment
                v-for="comment in comments"
                :key="comment.username + comment.comment"
                :comment="comment.comment"
                :name="comment.name"
                :username="comment.username"
              />

              <Comment
                v-for="comment in newComments"
                :key="comment.username + comment.comment"
                :comment="comment.comment"
                :name="comment.name"
                :username="comment.username"
              />
            </div>
          </div>
        </div>

        <div class="doComment mx-auto" style="height:7.5%; width: 97%">
          <div class="send__group field flex">
            <input
              autocomplete="off"
              @keypress.enter="sendComment"
              v-model="sendStr"
              type="input"
              class="send__field -mr-6 select-none"
              placeholder="send"
              name="send"
              id="send"
              required
            />
            <label for="send" class="send__label">Yorum Yazın</label>

            <div
              @click="sendComment"
              id="searchIc"
              style="transition: opacity 0.2s;margin-top:0.3rem"
            >
              <img
                src="/icons/paper-plane.svg"
                style="width:1.3rem;"
                class="sendBtn cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Comment from "@/components/Comment";

export default {
  components: {
    Comment
  },
  data() {
    return {
      sendStr: null,
      comments:
        this.$store.state.workUIDetails.comments == null ||
        this.$store.state.workUIDetails.comments == ""
          ? null
          : JSON.parse(`[${this.$store.state.workUIDetails.comments}]`),
      newComments: []
    };
  },
  methods: {
    closeUI() {
      this.$refs.workUI.style.opacity = "0";
      setTimeout(() => {
        this.$store.commit("closeWorkUI");
      }, 350);
    },

    sendComment() {
      this.newComments.push({
        comment: this.sendStr,
        name: this.$store.state.name,
        username: this.$store.state.username,
        workArea: this.$store.state.work_area
      });
      this.$axios
        .post("/api/comment", {
          token: this.$store.state.token,
          workId: this.$store.state.workUIDetails.id,
          commentary: this.sendStr
        })
        .then(result => {
          console.log(result.data);
        });

      this.sendStr = "";
    }
  },
  mounted() {
    console.log("-------------------------");
    console.log(this.$store.state.workUIDetails.comments);
    console.log(
      document.getElementById(this.$store.state.workUIDetails.id)
      // .getElementsByClassName("comments")
    );
    console.log("-------------------------");
    setTimeout(() => {
      this.$refs.workUI.style.opacity = "1";
    }, 10);
  }
};
</script>

<style>
.workUiBG {
  background: rgba(0, 0, 0, 0.2);
}

.workUI {
  width: 70vw;
  height: 75vh;
  margin-left: 15vw;
  margin-top: 10vh;
  border-radius: 4px;
}

.send__group {
  position: relative;
  padding: 15px 0 0;
  width: 100%;
}
.send__field {
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
.send__field::placeholder {
  color: transparent;
}
.send__field:placeholder-shown ~ .send__label {
  font-size: 1rem;
  cursor: text;
  top: 20px;
}
.send__label {
  position: absolute;
  top: 10px;
  display: block;
  transition: 0.2s;
  font-size: 0.7rem;
  color: #9b9b9b;
}
.send__field:focus {
  padding-bottom: 6px;
  border-image: linear-gradient(to right, #238bbb, #47bccc);
  border-image-slice: 1;
}
.send__field:focus ~ .send__label {
  position: absolute;
  top: 5px;
  display: block;
  transition: 0.2s;
  font-size: 0.7rem;
  color: #1e87b8;
  font-weight: 700;
}

.sendBtn {
  transition: color 0.1s;
  color: #8f8f8f;
  font-size: 1.1rem;
}

.send__field:focus ~ .sendBtn {
  color: #238bbb;
}
/* reset input */
.send__field:required,
.send__field:invalid {
  box-shadow: none;
}
</style>
