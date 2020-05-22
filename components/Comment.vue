<template>
  <div class="comment mb-1">
    <div class="comment-header flex items-center p-1">
      <div>
        <div
          style="background: rgb(202, 202, 202); padding-top:0.5rem; padding-bottom: 0.5rem;width:3rem"
          class="group rounded-full overflow-hidden shadow-inner text-center bg-purple table cursor-pointer"
        >
          <span
            class="group-hover:table-cell text-white font-bold align-middle text-xl"
          >
            {{ name[0] + name[1] }}
          </span>
        </div>
      </div>

      <div class="name ml-1">
        <p class="text-xl">{{ name }}</p>
        <p class="text-gray-600 font-sm -ml-1" style="margin-top:-0.3rem">
          @{{ username }}
        </p>
      </div>
    </div>
    <p class="px-1 text-gray-800">{{ comment }}</p>
  </div>
</template>

<script>
export default {
  props: {
    comment: String,
    name: String,
    username: String,
    workArea: String
  }
};
</script>
