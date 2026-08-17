<template>
  <div class="layout">
    <header class="header">
      <div class="container header__inner">
        <NuxtLink to="/" class="header__logo">
          Bonsai
        </NuxtLink>
        <nav class="header__nav">
          <NuxtLink to="/" class="header__link">Catalog</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="container">
        © {{ new Date().getFullYear() }} Bonsai Shop
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__logo {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1px;
}

.header__nav {
  display: flex;
  gap: 24px;
}

.header__link {
  font-weight: 500;
  transition: color 0.2s;
}

.header__link:hover {
  color: #BC002D;
}

.main {
  min-height: calc(100vh - 200px);
  padding: 20px 0 60px;
}

.footer {
  background: #111813;
  color: #fff;
  padding: 40px 0;
  text-align: center;
}
</style>