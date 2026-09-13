<template>
  <div class="header">
    <picture>
      <source media="(max-width: 767px)" srcset="/header-mobile.webp" />
      <source media="(max-width: 1679px)" srcset="/header-tablet.webp" />
      <source srcset="/header-desktop.webp" />
      <img src="/header-desktop.webp" alt="my bonsai" />
    </picture>
    <div class="header_text">My Bonsai</div>
  </div>
</template>

<style scoped>
.header {
  max-width: 2000px;
  height: 400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  user-select: none;
}

.header picture {
  display: block;
  width: 100%;
  height: 100%;
}

.header img {
  object-fit: cover;
  object-position: bottom center;
  width: 100%;
  height: 100%;
}

.header_text {
  font-family: 'misaki';
  text-transform: uppercase;
  font-size: 128px;
  line-height: 1;
  -webkit-text-stroke: 3px black;
  color: var(--white-color);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 1679px) {
  .header {
    height: 300px;
  }
  .header_text {
    font-size: 80px;
    -webkit-text-stroke: 2px black;
  }
}

@media (max-width: 767px) {
  .header {
    height: 200px;
  }
  .header_text {
    width: 100%;
    font-size: 64px;
    text-align: center;
  }
}
</style>