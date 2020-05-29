<template>
  <div
    :id="id"
    @click="zoomWork"
    class="work mb-3 overflow-hidden flex deadline w-full bg-white rounded-md border-solid border-2 border-gray-100 transition-colors duration-300 cursor-pointer"
    :class="
      where == 'deadline'
        ? 'h-36 shadow-md w-1/3 mr-3'
        : ' h-32 md:h-40 shadow-lg'
    "
  >
    <div v-if="where == 'normal'" class="w-41 p-2">
      <img :src="image" class="w-full h-full mt-1 mr-1 pr-1" />
    </div>
    <div class="w-4/6 truncate block pl-4 pt-3">
      <p class="text-2xl w-full truncate">
        {{ title }}
      </p>
      <p class="w-full truncate">
        {{ subtitle }}
        <!-- Bunu yapamadım hocam yardım lütfen -->
      </p>
      <p class="-mt-1 text-sm text-gray-700">
        {{ JSON.parse(owner).name }}
        <span class="uppercase text-xs ml-1">{{
          JSON.parse(owner).workArea
        }}</span>
      </p>

      <div
        v-if="type == 'survey'"
        class="mt-2"
        :class="where == 'deadline' ? 'w-11/12 mx-auto' : 'w-full'"
      >
        <div
          v-for="(answer, value) in answers"
          v-if="value < 2 /*&& !(where == 'deadline' && value >= 1)*/"
          @click="been"
          :id="id + answer"
          class="truncate option mx-auto border-solid border-2 border-gray-600 mb-2 rounded text-center text-gray-700 text-lg transition-colors duration-300"
          :class="where == 'deadline' ? '-mt-1' : ''"
          @mouseenter="entered"
          @mouseout="leaved"
          style="height:1.8rem;outline: none;"
        >
          {{ answer.slice(0, 19) }}{{ answer[19] != undefined ? "..." : "" }}
          {{
            makers[0] != undefined
              ? "(" +
                JSON.parse(`[${makers}]`).filter(maker => {
                  return maker.answers == answer;
                }).length +
                ")"
              : theMakers[0] != undefined
              ? `(${
                  theMakers.filter(maker => {
                    return maker.answers == answer;
                  }).length
                })`
              : ""
          }}
        </div>

        <div
          v-if="
            answers != undefined &&
              answers[2] !=
                undefined /*||
              (where == 'deadline' && answers[1] != undefined)*/
          "
          class="text-lg text-center"
          :class="where == 'deadline' ? '-mt-3' : '-mt-5'"
        >
          ...
        </div>
      </div>

      <div
        v-if="type.startsWith('homework')"
        class="flex w-32 pl-8 mt-1 mx-auto"
        style="color:#6e6e6e"
      >
        <div class="flex">
          <div class="flex mr-2">
            <div class="text-center">
              <img src="/icons/edit.svg" clas style="width:1.8rem" />
              <p class=" font-bold -ml-1">{{ makers }}</p>
            </div>
          </div>
          <div class="flex mr-2">
            <div class="text-center">
              <img src="/icons/comments.svg" style="width:1.76rem" />
              <p class="comments font-bold">
                {{
                  comments == undefined || comments == ""
                    ? 0
                    : JSON.parse(`[${comments}]`).length
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="type.startsWith('homework')"
        class="text-gray-500 w-32"
        :class="where == 'deadline' ? '-mt-2 -ml-1' : 'mt-2'"
      >
        {{
          Math.ceil(
            (new Date(finish).getTime() - new Date().getTime()) /
              (1000 * 3600 * 24)
          )
        }}
        gün kaldı
      </div>
    </div>
    <div class="w-36">
      <img
        v-if="where == 'deadline'"
        :src="image"
        class="w-full h-32 mt-2 mr-1 pr-1"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    where: String,
    type: String,
    id: String,
    title: String,
    owner: String,
    subtitle: String,
    makers: Number,
    shared: String,
    finish: String,
    image: String,
    comments: String,
    answers: Array
  },
  data() {
    return {
      dont_open: false,
      done: false,
      theMakers: []
    };
  },
  methods: {
    entered(e) {
      if (!this.done) {
        e.target.style.color = "white";
        e.target.style.border = "2px solid #3182ce";
        e.target.style.background = "#3182ce";
      }
    },
    leaved(e) {
      if (!this.done) {
        e.target.style.color = "#4a5568";
        e.target.style.border = "2px solid #718096";
        e.target.style.background = "none";
      }
    },
    been(e) {
      console.log(this.answers);
      if (!this.done) {
        this.dont_open = true;
        this.$axios
          .post("/api/dowork", {
            token: this.$store.state.token,
            workId: this.id,
            answers: e.target.id.split(this.id)[1]
          })
          .then(result => {
            console.log(result.data);
            e.target.style +=
              " ;border: 2px solid #3182ce; background:#3182ce; color:white";
            console.log(e.target.className);
            // this.$refs.answers;
            this.done = true;
            this.dont_open = false;
            this.theMakers = result.data.makers;
          });
      }
    },
    zoomWork() {
      if (!this.dont_open) {
        this.$store.commit("setWorkUI", {
          id: this.id,
          type: this.type,
          owner: this.owner,
          title: this.title,
          subtitle: this.subtitle,
          makers: this.makers,
          shared: this.shared,
          finish: this.shared,
          image: this.image,
          comments: this.comments,
          answers: this.answers
        });
      }
    }
  },
  mounted() {
    console.log(this.makers);
    if (this.makers.toString().startsWith(`{"username":`)) {
      console.log("Yapılmışko");
      const makersJSON = JSON.parse(`[${this.makers}]`);
      if (makersJSON[0] != undefined) {
        const selected = JSON.parse(`[${this.makers}]`).filter(maker => {
          return maker.username != null;
        });
        console.log(selected[0].answers);
        console.log(document.getElementById(selected[0].answers));
        document.getElementById(this.id + selected[0].answers).style +=
          " ;border: 2px solid #3182ce; background:#3182ce; color:white";
      }
      this.done = true;
    }
  }
};
</script>

<style scoped>
.work-icon {
  color: #6e6e6e;
}

.work:hover {
  background: rgba(233, 233, 233, 0.486);
}
</style>
