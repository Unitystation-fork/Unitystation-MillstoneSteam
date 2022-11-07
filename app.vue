<template>
  <div class="body">
    <Header @login="show" />
    <LoginForm :show-form="showForm" @close="closeForm" />
    <TaskList />
  </div>
</template>

<script setup>
const showForm = ref(false);
const show = () => {
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
};
</script>

<style>
* {
  font-family: "Ubuntu", sans-serif;
  color: white;
}
body {
  min-height: 100vh;
  background-color: #171e27;
}
</style>
