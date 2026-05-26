<script setup lang="ts">
const navItems = [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Opere',
    to: '/opere'
  },
  {
    label: 'Artisti',
    to: '/artisti'
  },
  {
    label: 'Mostre',
    to: '/mostre'
  },
  {
    label: 'Progetti',
    to: '/progetti'
  }
]
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="logo">
      Thetis Gallery
    </NuxtLink>

    <nav class="main-nav" aria-label="Navigazione principale">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 24px 40px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid #e8e8e8;
  backdrop-filter: blur(12px);
}

.logo {
  color: #111;
  font-size: 20px;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: -0.02em;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  color: #333;
  font-size: 15px;
  text-decoration: none;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #000;
  text-decoration: underline;
  text-underline-offset: 6px;
}

@media (max-width: 768px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .main-nav {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>