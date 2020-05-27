<template>
  <div v-if="sign">
    <form
      class="fileupload md:flex w-10/12 md:w-10/12 lg:w-6/12 mx-auto"
      :action="
        `${$store.state.storage}/upload?token=${$store.state.token}&type=${$route.params.type}&answers=${answers}`
      "
      method="post"
      enctype="multipart/form-data"
    >
      <div class="files md:-ml-8">
        <div class="workImage md:ml-0">
          <label for="workImage" class="workImageLabel">
            <img src="/icons/plus-circle.svg" class="w-12 h-12 mx-auto mt-24" />
          </label>
          <input
            ref="workImage"
            type="file"
            id="workImage"
            name="workImage"
            placeholder="Resim(Zorunlu Değil)"
            value=""
            @change="workImageChanged"
          />
          <div class="fileinfo">
            <div
              v-if="workImageName == undefined || workImageName == ''"
              class="info"
            >
              <h3 class="text-2xl ml-16">Resim Yükle</h3>
              <h3 class="text-xl ml-17">
                (İsteğe Bağlı)
              </h3>
            </div>
            <div
              v-if="workImageName != undefined"
              class="image_props text-center"
            >
              <p>{{ workImageName }}</p>
              <p>{{ workImageSize }} kb</p>
            </div>
          </div>
        </div>
      </div>
      <div class="inputs w-full md:ml-8">
        <label for="title"></label>
        <input
          v-model="title"
          @keypress.enter="sendWork"
          autocomplete="off"
          name="title"
          type="text"
          placeholder="Başlık"
          class="block border-b-2 border-solid border-gray-600 w-full text-xl mt-6"
          style="outline:none"
        />
        <div v-if="$route.params.type == 'text'" class="text">
          <label for="subtitle"></label>
          <input
            v-model="subtitle"
            @keypress.enter="sendWork"
            autocomplete="off"
            name="subtitle"
            type="text"
            placeholder="Açıklama"
            class="block border-b-2 border-solid border-gray-600 w-full text-xl mt-6"
            style="outline:none"
          />
        </div>

        <div
          v-else-if="$route.params.type == 'homework'"
          class="mt-1 w-8/12 float-left"
        >
          <div class="workFile">
            <label for="workFile" class="workfileLabel cursor-pointer">
              <img src="/icons/scroll.svg" class="w-10 h-10 float-left" />
              <p
                class="text-lg pt-1 pl-8"
                v-text="workFileName == undefined ? 'Dosya Seç' : workFileName"
              />
            </label>
            <p class="text-gray-700">(.docx, .pdf, .jpg, .jpeg, .png)</p>
            <input
              @change="workFileChanged"
              type="file"
              id="workFile"
              name="workFile"
              placeholder="Ödev Dosyası"
              value=""
            />
          </div>
          <div style="width: 158%" class="answers mt-5">
            <h1 class="text-center text-xl">
              Cevap Anahtarı
            </h1>
            <div v-for="(option, value) in answers" class="answer mt-2">
              <span class="text-gray-700">{{ value + 1 }}.</span>
              <input
                @keypress.enter="a"
                v-model="answers[value]"
                :id="'answer' + value"
                type="text"
                style="outline: none;"
                class="w-11/12 border-solid border-b-2 border-gray-500"
              />
            </div>
            <img
              src="/icons/plus.svg"
              class="w-6 h-6 mx-auto mt-2 cursor-pointer"
              @click="answers.push('')"
            />
          </div>
        </div>

        <div
          v-else-if="$route.params.type == 'survey'"
          class="w-8/12 float-left"
        >
          <ul class="mt-8 w-full" style="list-style:circle">
            <li v-for="(option, value) in answers">
              <input
                v-model="answers[value]"
                autocomplete="off"
                name="title"
                type="text"
                :placeholder="'Seçenek' + (value + 1)"
                class="block w-full text-lg mt-3"
                style="outline:none;border-bottom: 1.5px solid #718096"
              />
            </li>

            <img
              src="/icons/plus.svg"
              class="w-8 h-8 mx-auto mt-2 cursor-pointer"
              @click="answers.push('')"
            />
          </ul>
        </div>

        <button
          @click="sendWork"
          :type="
            (workImageName != undefined && workImageName != '') ||
            $route.params.type == 'homework'
              ? 'submit'
              : 'button'
          "
          style="outline: none"
          class="mt-3 mr-2 float-right cursor-pointer justify-center flex button bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md h-10 mr-1 w-16 pt-1"
          :class="
            $route.params.type == 'survey' || $route.params.type == 'homework'
              ? 'float-right mt-5'
              : ''
          "
        >
          <img src="/icons/paper-plane2.svg" class="w-8 h-8 -ml-1" alt="" />
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: null,
      subtitle: null,
      sign: null,
      workImageName: null,
      workImageSize: null,
      workFileName: null,
      answers: this.$route.params.type == "survey" ? ["", ""] : [""]
    };
  },
  methods: {
    workImageChanged(e) {
      console.log(e.target.files);
      if (e.target.files != undefined) {
        if (e.target.files[0] != undefined) {
          this.workImageName = e.target.files[0].name;
          this.workImageSize = e.target.files[0].size / 100;
        } else {
          this.workImageName = null;
        }
      } else {
        this.workImageName = null;
      }
    },
    a(e) {
      e.preventDefault();
      this.answers.push("");
      setTimeout(() => {
        document.getElementById("answer" + (this.answers.length - 1)).focus();
      }, 10);
    },
    workFileChanged(e) {
      if (e.target.files != undefined) {
        if (e.target.files[0] != undefined) {
          this.workFileName = e.target.files[0].name;
        } else {
          this.workFileName = null;
        }
      } else {
        this.workFileName = null;
      }
    },
    sendWork() {
      if (
        this.$route.params.type != "homework" &&
        (this.workImageName == undefined || this.workImageName == "")
      ) {
        this.$axios
          .post("/api/creatework", {
            type: this.$route.params.type,
            token: this.$store.state.token,
            title: this.title,
            subtitle: this.subtitle,
            answers: this.answers
          })
          .then(result => {
            console.log(result.data);
            if (result.data.err == undefined) {
              this.title = null;
              this.subtitle = null;
              this.answers =
                this.$route.params.type == "survey" ? ["", ""] : [""];
            }
          });
      }
    }
  },
  asyncData(context, callback) {
    if (
      context.route.params.type == "text" ||
      context.route.params.type == "survey" ||
      context.route.params.type == "homework"
    ) {
      console.log("okkk");
      callback(null, {
        sign: true
      });
    } else {
      callback(null, {
        sign: false
      });
    }
  },
  mounted() {
    if (!this.sign) {
      window.location = "/";
    }
  }
};
</script>

<style scoped>
input[type="file"] {
  display: none;
}

.workImageLabel {
  border: 1.5px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  width: 16rem;
  height: 16rem;
  border-radius: 8px;
}
</style>
