<template>
  <nuxt-link to="/work/123456" :class="where == 'deadline' ? 'w-1/3 mr-3' : ''" class="mb-3" tag="div">
  <div
    class=" overflow-hidden flex deadline w-full bg-white rounded-md border-solid border-2 border-gray-100 transition-colors duration-300 hover:bg-gray-100 cursor-pointer"
    :class="where == 'deadline' ? 'h-36 shadow-md' : ' h-32 md:h-40 shadow-lg'"
  >
    <div v-if="where == 'normal'" class="w-41 p-2">
      <img
        :src="image"
        class="w-full h-full mt-1 mr-1 pr-1"
      />
    </div>
    <div class="w-4/6 truncate block pl-4 pt-3">
      <p class="text-2xl w-full truncate">
        {{title}}
      </p>
      <p class="text-sm text-gray-700">
        {{JSON.parse(owner).name}}
        <span class="uppercase text-xs ml-2">{{JSON.parse(owner).workArea}}</span>
      </p>

      <div class="flex w-32 pl-8 mt-1 mx-auto" style="color:#6e6e6e">
        <div class="flex" v-if="!done">
        <div class="flex mr-2">
          <div class="text-center">
            <img src="/icons/edit.svg" clas style="width:1.8rem">
            <p class=" font-bold -ml-1"> {{makers}} </p>
          </div>
        </div>
         <div class="flex mr-2">
          <div class="text-center">
            <img src="/icons/comments.svg" style="width:1.76rem">
            <p class=" font-bold"> {{comments == undefined || comments == "" ? 0 : JSON.parse(`[${comments}]`).length}} </p>
          </div>
         </div>        

        </div>
            <img v-else src="/icons/check.svg" style="width:2.2rem" class="mt-2 ml-6">
      </div>
      <div v-if="!done" class="text-gray-500 w-32" :class="where == 'deadline' ? '-mt-2 -ml-1' : 'mt-2'/* && asd == undefined ? '' :''*/">
      {{
        Math.ceil(
            (new Date(finish).getTime() - new Date().getTime()) /
              (1000 * 3600 * 24)
          )
      }} 
      gün kaldı</div>
    </div>
    <div class="w-36">
      <img
        v-if="where == 'deadline'"
        :src="image"
        class="w-full h-32 mt-2 mr-1 pr-1"
      />
    </div>
  </div>
  </nuxt-link>
</template>

<script>

export default {
  // where type done
  props: {
    where: String,
    type: String,
    done: Boolean,
    id: String,
    title: String,
    owner: String,
    subtitle: String,
    makers: Number,
    shared: String,
    finish: String,
    image: String,
    comments: String
  },
  created(){
    console.log(this.owner)
  }
};
</script>

<style scoped>
  .work-icon{
    color: #6e6e6e
  }
</style>