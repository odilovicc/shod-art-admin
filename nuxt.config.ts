// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],
  app: {
    head: {
      title: 'Shod Art Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Админ-панель для мебельного бизнеса' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
    display: 'swap',
  },
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || 'Shod Art Admin',
    },
  },
});