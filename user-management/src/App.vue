<script setup lang="ts">
import DarkModeToggle from './components/DarkModeToggle.vue';
import UserMockData from './components/UserMockData.vue';
import UserFetchAPI from './components/UserFetchAPI.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">User Dashboard</h1>
      </div>
           <!-- <UserFetchAPI/> -->
      <UserMockData/>
      <DarkModeToggle class="absolute top-10 right-10"/>
    </div>

  </div>
</template>