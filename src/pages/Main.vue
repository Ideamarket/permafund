<template>
  <div class="container">
    <div class="permafundInteractionContainer">
      <PermafundInteraction />
    </div>
  </div>
</template>

<script>
import PermafundInteraction from '../components/PermafundInteraction'
export default {
  name: 'Main',
  components: {
    PermafundInteraction
  }
}
</script>

<style scoped>
.permafundInteractionContainer {
  width: 500px;
  max-width: 500px;
  margin: 0 auto;
}
</style>
