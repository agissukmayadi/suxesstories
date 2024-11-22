<template>
    <div class="talent-dashboard">
      <h2>Welcome to the Talent Dashboard</h2>
      <p>This page is only accessible by users with the 'talent' role.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "TalentDashboard",
  };
  </script>
  
  <style scoped>
  .talent-dashboard {
    text-align: center;
    padding: 20px;
  }
  </style>
  