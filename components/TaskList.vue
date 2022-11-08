<template>
  <div class="body">
    <h2 class="tasks"
      v-if="tasks.length > 0"
      v-for="task in tasks"
      id="tasks"
      v-bind="task"
      :key="task.id"
    >
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
</script>

<style>

.body{

  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 75px;
  padding: 10px;

}

.tasks{

  height: 25px;
  margin-top: 5px;
}

#tasks {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 200px;
  padding: 10px;
}

</style>
