<template>
  <div>
    <div v-if="type == 'pdf'" id="pdfdiv">
      <div v-if="!error" class="top-bar">
        <button class="btn" id="prev-page">
          Prev Page
        </button>
        <button class="btn" id="next-page">
          Next Page
        </button>
        <span class="page-info">
          Page <span id="page-num"></span> of <span id="page-count"></span>
        </span>
      </div>

      <div
        v-if="error"
      >
        <p>Hmmm...</p>
        <p>Sanırım hata bizden kaynaklanmıyor</p>
        <p>Hatalı yada bozuk bir PDF dosyası yüklenmiş</p>
        <p>Bu durumu öğretmeninizle görüşün</p>
      </div>

      <canvas id="pdf-render"></canvas>
    </div>
    <div v-else-if="type == 'docx'" v-html="docxhtml"></div>
    <div v-else-if="type == null">
        <p class="text-4xl">Aradığınız Ödev Bulunamadı</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: false,
      type: null,
      docxhtml: null
    };
  },
  methods: {
    createPDF() {
    //  const url = `../${this.$route.params.workId}.pdf`;
      const url = `../${this.$route.params.workId}.pdf`;

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
    if (this.type == "pdf") {
        this.createPDF();
    };
  },
    asyncData(context, callback) {
    context.$axios
      .post("/api/getwork", { id: context.route.params.workId })
      .then(result => {
        callback(null, {
          type: result.data.type,
          docxhtml: result.data.html
        });
      });
  }

};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.top-bar {
  background: #333;
  color: #fff;
  padding: 1rem;
}

.btn {
  background: coral;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.7rem 2rem;
}

.btn:hover {
  opacity: 0.9;
}

.page-info {
  margin-left: 1rem;
}

.error {
  background: orangered;
  color: #fff;
  padding: 1rem;
}
</style>
