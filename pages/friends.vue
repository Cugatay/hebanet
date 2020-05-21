<template>
    <div class="w-11/12 mx-auto">

         <div class="header mx-auto md:w-10/12 w-full text-left mb-1 text-2xl">
          <hr style="margin-bottom:-1.3rem" />
          <p class="bg-white pl-1 ml-4" style="width:7.5rem">Arkadaşlar</p>
        </div>

        <div v-if="friends != undefined && friends != ''" class="users mx-auto w-10/12">
          <UserCard v-for="(friend, value) in friends" :key="friend.username" class="float-left mb-3" :class="value%3 == 0 && value == 0  ? '' : value%2 == 0 ? 'mr-2' : ''" :username="friend.username" :nameSurname="friend.name" :workArea="friend.work_area" :description="friend.description" />
        </div>
        <div v-else-if="friends == undefined" class="text-center -ml-24 text-gray-600">
            Daha hiç kimseyi eklemedin. Kullanıcıları aramaya ve eklemeye hemen başlayabilirsin!
        </div>
    </div>
</template>

<script>
import Cookie from 'js-cookie'

import UserCard from '@/components/UserCard'

export default {
    components: {
        UserCard
    },
    data(){
        return{
            friends: ""
        }
    },
    created(){
      this.$axios
      .post("/api/getuser", { username: "", password:"", why:"userpage", token: Cookie.get('token')})
      .then(result => {
        
           this.friends = result.data.friends != undefined && result.data.friends != "" ? JSON.parse(`[${result.data.friends}]`) : null;
        
      });
    }
}
</script>