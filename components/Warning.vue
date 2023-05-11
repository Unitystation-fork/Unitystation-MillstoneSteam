<template>
  <div>
    <span class="material-symbols-outlined"> warning </span>
    <p>
      Les liens présents sous les différentes tâches sont confidentiels et, en
      les consultant, vous vous engagez à ne pas les divulguer sans quoi vous
      serez banni de ce projet.
    </p>
    <span class="material-symbols-outlined close" @click="$emit('closeWarning')"
      >close</span
    >
  </div>
</template>

<style scoped>
div {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #ce3040;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  font-size: 1.2rem;
  font-weight: 600;
}

.close {
  cursor: pointer;
}

.close:hover {
  color: #eb394b;
}
</style>
