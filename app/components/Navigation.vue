<template>
  <div class="navigation">
    <div class="navigation__icon">
      <NavigationIcon :size="48" />
    </div>
    <div class="navigation__item">
      <NuxtLink to="/">Home</NuxtLink>
    </div>
    <div class="navigation__item">
      <NuxtLink to="/bonsai">Bonsai</NuxtLink>
    </div>
    <div class="navigation__item">
      <NuxtLink to="/services">Services</NuxtLink>
    </div>
    <div class="navigation__item">
      <NuxtLink to="/gallery">Gallery</NuxtLink>
    </div>
    <div class="navigation__item">
      <NuxtLink to="/contacts">Contacts</NuxtLink>
    </div>
    <div class="navigation__icon">
      <NavigationIcon :size="48" />
    </div>
  </div>
</template>

<style scoped>
.navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: -24px;
  padding-bottom: 16px;
  position: relative;
  z-index: 5;
}
.navigation:after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--accent-color);
  position: absolute;
  left: 0;
  bottom: 0;
}
.navigation__item {
  font-weight: 500;
  font-size: 16px;
  text-transform: uppercase;
  position: relative;
}
.navigation__item:after {
  content: "";
  width: 0%;
  height: 1px;
  background-color: var(--accent-color);
  position: absolute;
  left: 0;
  bottom: -2px;
  transition: width 0.3s;
}
.navigation__item:hover:after,
.navigation__item:has(.router-link-active):after {
  width: 100%;
}
.navigation__item a {
  text-decoration: none;
  color: #444444;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
}
.navigation__item:hover a,
.navigation__item:has(.router-link-active) a {
  color: var(--accent-color);
}

@media (max-width: 1199px) {
  .navigation {
    flex-wrap: wrap;
    margin-top: -8px;
    padding-bottom: 8px;
  }
}
@media (max-width: 767px) {
  .navigation {
    flex-direction: column;
    gap: 12px;
  }
  .navigation__item:after {
    bottom: 0;
  }
  .navigation__icon:first-child {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
  .navigation__icon:last-child {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>