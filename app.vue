<template>
  <div>
    <NuxtWelcome />
  </div>
</template>

<script setup>
const user = await fetch("http://localhost:3000/api/user").then((res) =>
  res.json().catch((err) => console.log(err))
);

const postUser = await fetch("http://localhost:3000/api/user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    password: "123456",
  }),
}).then((res) => res.json().catch((err) => console.log(err)));

console.log(user);
console.log(postUser);
</script>
