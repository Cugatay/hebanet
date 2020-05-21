<template>
    <div class="w-11/12 mx-auto">

         <div class="header mx-auto md:w-10/12 w-full text-left mb-1 text-2xl">
          <hr style="margin-bottom:-1.3rem" />
          <p class="bg-white pl-1 ml-4" style="width:8.8rem" v-text="$store.state.work_area == undefined ? 'Öğretmenler' : 'Öğrencilerin'" />
        </div>

        <div v-if="members != undefined && members != ''" class="users mx-auto w-10/12">
          <UserCard v-for="(member, value) in members" :key="member.username" class="float-left mb-3" :class="value%3 == 0 && value == 0  ? '' : value%2 == 0 ? 'mr-2' : ''" :username="member.username" :nameSurname="member.name" :workArea="member.work_area" :description="member.description" />
        </div>
        <div v-else-if="members == undefined" class="text-center text-gray-600" :class="$store.state.work_area == undefined ? '-ml-24' : ''" v-text="$store.state.work_area == undefined ? 'Daha hiç kimseyi eklemedin. Kullanıcıları aramaya ve eklemeye hemen başlayabilirsin!' : 'Şuan için hiçbir öğrencin yok ve sadece öğrenciler seni ekleyebilir. Yani öğrencilerine Heba\'ya katıldığını söyle ve seni takip etmeye başlamalarını bekle'">
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
            members: ""
        }
    },
    created(){
        if(this.$store.state.work_area == undefined){
      this.$axios
      .post("/api/getuser", { username: "", password:"", why:"userpage", token: Cookie.get('token')})
      .then(result => {
        
           this.members = result.data.teachers != undefined && result.data.teachers != "" ? JSON.parse(`[${result.data.teachers}]`) : null;
        
      });
        }
        else{
      this.$axios
      .post("/api/getuser", { username: "", password:"", why:"getstudents", token: Cookie.get('token')})
      .then(result => {
                console.log(result.data)
           this.members = result.data[0] != undefined ? result.data : null;
        
      });
 
        }
    }
}
</script>