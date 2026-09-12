<template>
  <div class="footer">
    <div class="footer__wrap">Copyright © {{ currentYear }} <a href="https://my-bonsai.eu">My Bonsai</a></div>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  margin-top: 80px;
  border-top: 2px solid var(--accent-color);
  font-size: 14px;
}
.footer a {
  color: var(--accent-color);
}

@media (max-width: 767px) {
  .footer {
    margin-top: 40px;
  }
}
</style>