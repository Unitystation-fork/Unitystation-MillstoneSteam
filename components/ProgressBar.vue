<template>
  <div class="container">
    <span>Progression : {{ progressionRatio }} % </span>
    <div class="progress-bar">
      <div class="second-container" :style="{'width' : (progressionRatio * 0.75) + 'vw'}">
        <li class="finished-task" v-for="t in finishedTasks"></li>
      </div>
      <li class="img">
        <img src="~/assets/img/cursor.gif" alt="progress-bar-cursor" />
      </li>
      <div class="third-container" :style="{'width' : ((100 - progressionRatio) * 0.75) + 'vw'}">
        <li class="unfinished-task" v-for="t in unfinishedTasks"></li>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from "~~/stores/task";
const taskStore = useTaskStore();
const taskId = taskStore.id;
const finishedTasks = computed(() =>
  taskStore.tasks.filter((task) => task.completed)
);
const unfinishedTasks = computed(() =>
  taskStore.tasks.filter((task) => !task.completed)
);
const progressionRatio = computed(() => {
  const finishedTasksLength = finishedTasks.value.length;
  const unfinishedTasksLength = unfinishedTasks.value.length;
  const totalTasksLength = finishedTasksLength + unfinishedTasksLength;
  return Math.round((finishedTasksLength / totalTasksLength) * 100);
});
</script>

<style scoped>
li {
  list-style: none;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 54px 0;
}

.second-container,
.third-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.second-container {
  background: linear-gradient(to right, #6665d2, rgb(150, 81, 150));
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  height: 32px;
}

.third-container {
  background-color: #c4c4c4;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
}
.text {
  font-size: larger;
  font-weight: bold;
  color: #000;
}

.progress-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 64px;
  max-width: 90vw;
}
.finished-task {
  background-color: transparent;
  width: 100%;
  height: 32px;
}

.unfinished-task {
  background-color: transparent;
  width: 100%;
  height: 32px;
}
.img {
  width: 0;
  overflow: visible;
  position: relative;
  height: 22px;
}

img {
  width: 44px;
  position: absolute;
  left: -22px;
  top: calc(-44px - 8px);
}

@media (max-width: 768px) {
  .progress-bar {
    width: 100%;
  }
}
</style>
