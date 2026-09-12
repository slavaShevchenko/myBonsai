<template>
  <div class="loading">
    <div class="loading__spinner">
      <NavigationIcon :size="80" />
    </div>
    <div class="loading__text">loading</div>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 100dvh;
  width: 100dvw;
  background-color: var(--white-color);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
.loading__spinner {
  transform-origin: center;
  animation: spin 3s linear infinite;
}
.loading__text {
  font-family: 'misaki';
  color: #333;
  font-size: 64px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>