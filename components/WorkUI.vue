<template>
  <div
    ref="workUI"
    style="opacity: 0;transition: opacity 0.35s"
    class="w-full h-full"
  >
    <div @click="closeUI" class="workUiBG w-full h-full" />
    <!-- --------------------------------------------------------------------------------------------------- -->
    <div class="workUI bg-white overflow-hidden absolute top-0 mx-auto flex">
      <div class=" w-4/6 block p-6 pt-4">
        <div class="header flex items-center">
          <img
            v-if="type != 'text'"
            :src="$store.state.workUIDetails.image"
            class="w-20 h-20 mr-2 rounded"
            alt=""
          />
          <p class="text-3xl w-10/12">
            {{ $store.state.workUIDetails.title }}
          </p>
          <button
            v-if="$store.state.workUIDetails.type.startsWith('homework')"
            class="button select-none bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-bold py-1 px-2 rounded-full"
            style="min-width:8.5rem; outline: none"
          >
            Yapmaya Başla
          </button>
        </div>
        <p
          v-if="$store.state.workUIDetails.subtitle != undefined"
          class="text-lg"
        >
          {{ $store.state.workUIDetails.subtitle }}
        </p>
        <img
          v-if="$store.state.workUIDetails.type == 'text'"
          class="w-full mt-1"
          style="height:88%"
          :src="$store.state.workUIDetails.image"
        />
        <div
          v-if="$store.state.workUIDetails.type == 'survey'"
          class="w-full mt-3 overflow-auto"
          style="height:87%"
        >
          <div
            v-for="(answer, value) in $store.state.workUIDetails.answers"
            v-if="value < 2 /*&& !(where == 'deadline' && value >= 1)*/"
            @click="been"
            :id="$store.state.workUIDetails.id + answer"
            class="truncate cursor-pointer option mx-auto border-solid border-2 border-gray-600 mb-2 rounded text-center text-gray-700 text-lg transition-colors duration-300"
            @mouseenter="entered"
            @mouseout="leaved"
            style="height:2rem;outline: none;"
          >
            {{ answer.slice(0, 19) }}{{ answer[19] != undefined ? "..." : "" }}
            {{
              $store.state.workUIDetails.makers[0] != undefined
                ? "(" +
                  JSON.parse(`[${$store.state.workUIDetails.makers}]`).filter(
                    maker => {
                      return maker.answers == answer;
                    }
                  ).length +
                  ")"
                : theMakers != undefined && theMakers[0] != undefined
                ? `(${
                    theMakers.filter(maker => {
                      return maker.answers == answer;
                    }).length
                  })`
                : ""
            }}
          </div>
        </div>
        <div
          class="h-full overflow-auto"
          v-if="$store.state.workUIDetails.type.startsWith('homework')"
        >
          <div
            v-if="
              $store.state.workUIDetails.type.split('/')[1] == 'jpeg' ||
                $store.state.workUIDetails.type.split('/')[1] == 'jpg' ||
                $store.state.workUIDetails.type.split('/')[1] == 'png'
            "
          >
            <img
              class="mx-auto"
              :src="
                $store.state.storage +
                  `/download/${$store.state.workUIDetails.id}.jpeg`
              "
              alt=""
            />
          </div>

          <div
            v-else-if="$store.state.workUIDetails.type.endsWith('pdf')"
            id="pdfdiv"
            style=""
            class="h-full mt-6"
          >
            <div v-if="!error" class="top-bar flex items-center justify-around">
              <div class="button">
                <button style="outline:none" class="btn" id="prev-page">
                  <img
                    src="/icons/chevron-left.svg"
                    class="w-8 h-8 border-solid border-2 px-1 py-1 border-gray-500 rounded-full hover:bg-gray-500 transition-colors duration-300"
                    alt=""
                  />
                </button>
                <button style="outline:none" class="btn" id="next-page">
                  <img
                    src="/icons/chevron-right.svg"
                    class="w-8 h-8 border-solid border-2 px-1 py-1 border-gray-500 rounded-full hover:bg-gray-500 transition-colors duration-300"
                    alt=""
                  />
                </button>
              </div>
              <div class=" text-gray-600 text-lg">Önizleme</div>
              <span class="page-info">
                Sayfa <span id="page-num"></span>/<span id="page-count"></span>
              </span>
            </div>

            <div v-if="error"></div>

            <canvas class="w-full" id="pdf-render"></canvas>
          </div>

          <div v-else-if="$store.state.workUIDetails.type.endsWith('docx')">
            <div v-html="innerdocx"></div>
          </div>
        </div>
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
              class="text-center text-gray-600 pt-2"
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
                :comment="comment.comment"
                :name="comment.name"
                :username="comment.username"
              />

              <Comment
                v-for="comment in newComments"
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
              style="width: 92%"
              autocomplete="off"
              @keypress.enter="sendComment"
              v-model="sendStr"
              type="input"
              class="send__field mr-2 select-none"
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
      innerdocx: "",
      sendStr: null,
      comments:
        this.$store.state.workUIDetails.comments == null ||
        this.$store.state.workUIDetails.comments == ""
          ? null
          : JSON.parse(`[${this.$store.state.workUIDetails.comments}]`),
      newComments: [],
      theMakers: []
    };
  },
  methods: {
    closeUI() {
      this.$refs.workUI.style.opacity = "0";
      setTimeout(() => {
        this.$store.commit("closeWorkUI");
      }, 350);
    },
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
      if (!this.done) {
        this.dont_open = true;
        this.$axios
          .post("/api/dowork", {
            token: this.$store.state.token,
            workId: this.$store.state.workUIDetails.id,
            answers: e.target.id.split(this.$store.state.workUIDetails.id)[1]
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

    sendComment() {
      this.newComments.push({
        comment: this.sendStr,
        name: this.$store.state.name,
        username: this.$store.state.username,
        workArea: this.$store.state.work_area
      });
      this.$store.commit("addComment", {
        id: this.$store.state.workUIDetails.id,
        comment: this.sendStr,
        username: this.$store.state.username,
        name: this.$store.state.name,
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
    },
    readHTML() {
      this.$axios
        .get(
          `${this.$store.state.storage}/download/${this.$store.state.workUIDetails.id}.html`
        )
        .then(res => {
          this.innerdocx = res.data;
        });
    },
    createPDF() {
      console.log("ollllllll");
      //  const url = `../${this.$route.params.workId}.pdf`;
      const url = `${this.$store.state.storage}/download/${this.$store.state.workUIDetails.id}.pdf`;
      console.log(url);

      let pdfDoc = null,
        pageNum = 1,
        pageIsRendering = false,
        pageNumIsPending = null;

      const scale = 1.5,
        canvas = document.querySelector("#pdf-render"),
        ctx = canvas.getContext("2d");

      // Render the page
      const renderPage = num => {
        pageIsRendering = true;

        // Get page
        pdfDoc.getPage(num).then(page => {
          // Set scale
          const viewport = page.getViewport({ scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderCtx = {
            canvasContext: ctx,
            viewport
          };

          page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
              renderPage(pageNumIsPending);
              pageNumIsPending = null;
            }
          });

          // Output current page
          document.querySelector("#page-num").textContent = num;
        });
      };

      // Check for pages rendering
      const queueRenderPage = num => {
        if (pageIsRendering) {
          pageNumIsPending = num;
        } else {
          renderPage(num);
        }
      };

      // Show Prev Page
      const showPrevPage = () => {
        if (pageNum <= 1) {
          return;
        }
        pageNum--;
        queueRenderPage(pageNum);
      };

      // Show Next Page
      const showNextPage = () => {
        if (pageNum >= pdfDoc.numPages) {
          return;
        }
        pageNum++;
        queueRenderPage(pageNum);
      };

      // Get Document
      pdfjsLib
        .getDocument(url)
        .promise.then(pdfDoc_ => {
          pdfDoc = pdfDoc_;

          document.querySelector("#page-count").textContent = pdfDoc.numPages;

          renderPage(pageNum);
        })
        .catch(err => {
          this.error = true;
        });

      // Button Events
      document
        .querySelector("#prev-page")
        .addEventListener("click", showPrevPage);
      document
        .querySelector("#next-page")
        .addEventListener("click", showNextPage);
    }
  },
  mounted() {
    if (this.$store.state.workUIDetails.type == "homework/pdf") {
      console.log("PDF MAN");
      this.createPDF();
    } else if (this.$store.state.workUIDetails.type == "homework/docx") {
      this.readHTML();
    }
    console.log("-------------------------");
    console.log(this.$store.state.workUIDetails);
    console.log(
      document.getElementById(this.$store.state.workUIDetails.id)
      // .getElementsByClassName("comments")
    );
    console.log("-------------------------");
    setTimeout(() => {
      this.$refs.workUI.style.opacity = "1";
    }, 10);
    if (
      this.$store.state.workUIDetails.makers
        .toString()
        .startsWith(`{"username":`)
    ) {
      console.log("Yapılmışko");
      const makersJSON = JSON.parse(
        `[${this.$store.state.workUIDetails.makers}]`
      );
      if (makersJSON[0] != undefined) {
        const selected = JSON.parse(
          `[${this.$store.state.workUIDetails.makers}]`
        ).filter(maker => {
          return maker.username != null;
        });
        console.log(selected[0].answers);
        console.log(document.getElementById(selected[0].answers));
        document.getElementById(
          this.$store.state.workUIDetails.id + selected[0].answers
        ).style +=
          " ;border: 2px solid #3182ce; background:#3182ce; color:white";
      }
      this.done = true;
    }
  }
};
</script>

<style>
.workUiBG {
  background: rgba(0, 0, 0, 0.2);
}

.workUI {
  width: 70%;
  height: 75%;
  margin-left: 15%;
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
