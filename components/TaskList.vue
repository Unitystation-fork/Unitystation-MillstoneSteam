<template>
  <div>
    <h2 v-if="tasks.length > 0" v-for="task in tasks" id="tasks" v-bind="task" :key="task.id">
      {{ task.title }}
    </h2>
    <h2 v-else>No tasks</h2>
  </div>
</template>

<script setup>
import { useTaskStore } from "~/stores/task";
const tasks = ref([]);
const taskStore = useTaskStore();

onMounted(async () => {
  await taskStore.setTasks();
  tasks.value = taskStore.tasks;
});

onUpdated(async () => {
  await taskStore.setTasks();
  tasks.value = taskStore.tasks;
});

</script>

<style>
#tasks {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 1px solid black;
  margin-top: 200px;
  padding: 10px;
}
.space {
  margin-right: 50px;
}

.colorBlack {
  color: black;
}
</style>
