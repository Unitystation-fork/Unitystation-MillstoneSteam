<template>
    <form action="">
        <!-- <input type="text" v-model="titleInput"/>
        <input type="text" v-model="contentInput"/>
        <input type="checkbox" v-model="completedInput"/>
        <input class="colorText" type="submit" value="OK"/> -->
    </form>

</template>



<script setup>
defineProps({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    }
})

// import { useJwtStore } from "~~/stores/jwt"
// import { useTaskStore } from "~~/stores/task"

console.log(id)
/*
console.log(id, title, content, completed)
const taskStore = useTaskStore()
await taskStore.setTasks()
const jwtStore = useJwtStore()

const titleInput = ref(title);
const contentInput = ref(content);
const completedInput = ref(false); //ref() variable reactif dans Vue




async function updateTask(id){
  const res = await fetch("http://localhost:3000/api/task/" + id,{
    headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtStore.jwt
    },
    method : "PUT",

    body: JSON.stringify({
      title: titleInput.value,
      content: contentInput.value,
      completed: completedInput.value,
    }),
  })
  .then(r => r.json())
  .catch(e => console.log("error", e));

}
*/


</script>


<style>

.colorText {
  color: black;
  margin: 10px;
}

</style>