<script setup>
import ItemList from './views/ItemList.vue'
</script>

<template>
  <header class="header">
    <div class="container title">校园二手交易平台 · Vue3</div>
  </header>

  <main class="container">
    <ItemList />
  </main>
</template>

<style scoped>
.header {
  background: #2f6fed;
  color: #fff;
  padding: 16px 0;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}
</style>
