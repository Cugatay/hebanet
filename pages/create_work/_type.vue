<template>
  <div v-if="sign">
    <form
      class="fileupload md:flex w-10/12 md:w-8/12 mx-auto"
      :action="
        `${$store.state.storage}/upload?token=${$store.state.token}&type=${$route.params.type}`
      "
      method="post"
      enctype="multipart/form-data"
    >
      <div class="files md:-ml-8">
        <div class="workImage">
          <label for="workImage" class="custom-file-upload md:ml-0 ml-20">
            Work Image
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
              <h3 class="text-2xl text-center">Resim Yükle</h3>
              <h3 class="text-xl text-center">(İsteğe Bağlı)</h3>
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

        <!-- <div class="workFile">
            <label for="workFile" class="custom-file-upload">
              Work File
          </label>
            <input type="file" id="workFile" name="workFile" placeholder="Ödev Dosyası"  value="" />
          </div> -->
      </div>
      <div class="inputs w-full md:ml-8">
        <label for="title"></label>
        <input
          autocomplete="off"
          name="title"
          type="text"
          placeholder="Başlık"
          class="block border-b-2 border-solid border-gray-600 w-full text-xl mt-6"
          style="outline:none"
        />

        <label for="subtitle"></label>
        <input
          autocomplete="off"
          name="subtitle"
          type="text"
          placeholder="Açıklama"
          class="block border-b-2 border-solid border-gray-600 w-full text-xl mt-6"
          style="outline:none"
        />

        <button
          :type="
            workImageName == undefined || workImageName == ''
              ? 'button'
              : 'submit'
          "
          style="outline: none"
          class="mt-3 mr-2 float-right cursor-pointer justify-center flex button bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-md h-10 mr-1 w-16"
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
      sign: null,
      workImageName: null,
      workImageSize: null
    };
  },
  methods: {
    workImageChanged(e) {
      console.log(e.target.files);
      if (e.target.files != undefined) {
        this.workImageName = e.target.files[0].name;
        this.workImageSize = e.target.files[0].size / 100;
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

.custom-file-upload {
  border: 1.5px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  width: 16rem;
  height: 16rem;
  border-radius: 8px;
}
</style>
