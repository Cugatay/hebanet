<template>
    <div style="width:20rem;" class="overflow-hidden h-41 userCard bg-white shadow-lg border-solid border-2 border-gray-100 rounded-lg">
        <div class="user-infos flex h-16 items-center w-12/12 mx-auto p-2 pl-3">
            <nuxt-link :to="'/user/' + username" class="flex items-center">
            <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              class="w-14 h-14 rounded-full cursor-pointer"
            />
        </nuxt-link>
            <div class="ml-1 block">
              <p :style="workArea != undefined ? 'max-width:9rem' : 'max-width:14rem;'" class="mt-1 truncate text-2xl font-normal">
              {{nameSurname}}
              </p>
              <p class="-mt-2 -ml-1 text-gray-500">
                  @{{username}}
              </p>
            </div>
            <p style="max-width:5rem" class="uppercase text-xs ml-3 -mt-3">
              {{workArea}}
            </p>
          </div>
          <div class="description text-lg w-10/12 mx-auto h-14 overflow-hidden">
          {{description}}
          </div>
          <div class="w-full text-center mt-1">
              <FollowBtn v-if="$store.state.username != username" class="mt-1" :username="username" :isTeacher="workArea == undefined ? false : true" />
          </div>
    </div>
</template>

<script>
import FollowBtn from '@/components/FollowBtn'

export default {
    components: {
        FollowBtn
    },
    props: {
      username: String,
      nameSurname: String,
      workArea: String,
      description: String
    }
}
</script>