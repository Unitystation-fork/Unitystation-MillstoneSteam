<template>
  <div class="body">
    <h2 class="tasks" v-for="task in taskStore.tasks" id="tasks" :key="task.id">
      {{ task.title }}
    </h2>
    <h2 v-if="tasks?.length === 0">No tasks</h2>
  </div>
</template>

<script setup>
import { useTaskStore } from "~/stores/task"
const taskStore = useTaskStore()
await taskStore.setTasks()
</script>

<style>
.body {

  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 75px;
  padding: 10px;

}

.tasks {

  height: 25px;
  margin-top: 5px;
}

#tasks {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
}
</style>
