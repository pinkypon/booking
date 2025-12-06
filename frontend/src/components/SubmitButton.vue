<!-- src/components/SubmitButton.vue -->
<script setup>
const emit = defineEmits(['submit']) // define the event name

function clickHandler() {
  emit('submit') // send the event to parent
}
</script>

<template>
  <button @click="clickHandler">Submit</button>
</template>
