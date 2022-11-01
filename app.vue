<template>
  <div class="body">
    <Header @login="show" :key="headerKey" />
    <LoginForm :show-form="showForm" @close="closeForm" />
  </div>
</template>

<script setup>
const showForm = ref(false);
const headerKey = ref(0);
const show = () => {
  showForm.value = true;
};

const closeForm = () => {
  headerKey.value += 1;
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
