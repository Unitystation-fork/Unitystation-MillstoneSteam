<template>
  <div class="body">
    <Header @login="show" />
    <LoginForm :show-form="showForm" @close="closeForm" />
    <TaskList />
    <AddTaskForm />
    <Footer />
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

<style scoped>
* {
  font-family: "Ubuntu", sans-serif;
  color: white;
}
.body {
  background-color: #171e27;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>
