<template>
  <div class="body">
    <Header @login="show" id="haut"/>
    <LoginForm :show-form="showForm" @close="closeForm" />
    <TaskList />
    <AddTaskForm />
    <a href="#haut"><img id="cRetour" src="./Images/arrow_up.png" alt="up"></a>
    <!-- <a id="cRetour" href="#haut">HAUT</a> -->
  </div>
</template>

<script setup>
const showForm = ref(false);
const listKey = ref(0);
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
#cRetour{
  position: fixed;
  bottom: 20px;
  right: 50px;
}
</style>
