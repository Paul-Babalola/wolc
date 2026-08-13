<script setup lang="ts">
definePageMeta({layout: 'auth', middleware: 'guest'})

import logoUrl from '~/assets/css/images/logo.png'

const supabase = useSupabaseClient()
const route = useRoute()

const loginImage = '/images/site/homepage-hero.jpeg'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const forbiddenMsg = computed(() =>
  route.query.error === 'forbidden'
    ? 'This account is not authorized for admin access.'
    : '',
)

async function signIn() {
  loading.value = true
  errorMsg.value = ''

  const {error} = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value,
  })

  loading.value = false

  if (error) {
    errorMsg.value = error.message
    return
  }

  try {
    await $fetch('/api/admin/me')
  } catch {
    await supabase.auth.signOut()
    errorMsg.value = 'This account is not authorized for admin access.'
    return
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
  await navigateTo(redirect)
}

useSiteSeo({title: 'Admin sign in', description: 'Staff sign in for RCCG Word of Life Center.', noindex: true})
</script>

<template>
  <div class="login-page">
    <div class="login-shell">
      <div class="login-visual" aria-hidden="true">
        <img
          class="login-visual__img"
          :src="loginImage"
          alt=""
          width="1200"
          height="1600"
        >
        <div class="login-visual__overlay" />
        <div class="login-visual__copy">
          <p class="login-visual__eyebrow">RCCG Word of Life Center</p>
          <p class="login-visual__title">Staff portal</p>
          <p class="login-visual__text">Manage events, messages, and community registrations in one place.</p>
        </div>
      </div>

      <div class="login-panel">
        <div class="login-panel__inner">
          <img :src="logoUrl" alt="RCCG Word of Life Center" class="login-logo" width="180" height="32">
          <p class="eyebrow-dark">Staff</p>
          <h1>Sign in</h1>
          <p class="login-lead">Use your authorized staff account to access the admin dashboard.</p>

          <form class="form-stack" @submit.prevent="signIn">
            <label>
              <span class="field-label">Email</span>
              <input v-model="email" class="form-field" type="email" autocomplete="email" required>
            </label>

            <label>
              <span class="field-label">Password</span>
              <input v-model="password" class="form-field" type="password" autocomplete="current-password" required>
            </label>

            <p v-if="forbiddenMsg" class="form-error">{{ forbiddenMsg }}</p>
            <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

            <button class="btn btn-primary login-submit" type="submit" :disabled="loading">
              {{ loading ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>

          <NuxtLink to="/" class="login-back">← Back to website</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--paper);
}

.login-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
}

.login-visual {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(145deg, #0f172a 0%, #1e3a8a 100%);
}

.login-visual__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-visual__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.72) 100%),
    linear-gradient(90deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.08) 100%);
}

.login-visual__copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100%;
  padding: clamp(32px, 5vw, 56px);
  color: var(--white);
  max-width: 34rem;
}

.login-visual__eyebrow {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.login-visual__title {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin-top: 12px;
}

.login-visual__text {
  margin-top: 14px;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.82);
}

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(28px, 5vw, 48px);
  background: var(--white);
}

.login-panel__inner {
  width: min(100%, 420px);
}

.login-logo {
  height: 32px;
  width: auto;
  max-width: 180px;
  object-fit: contain;
  margin-bottom: 20px;
}

h1 {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  line-height: 1.04;
  letter-spacing: -0.025em;
  margin-top: 8px;
  margin-bottom: 8px;
}

.login-lead {
  color: var(--muted);
  margin-bottom: 28px;
  line-height: 1.6;
}

.field-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.form-error {
  color: var(--error);
  font-size: 0.92rem;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: rgba(192, 57, 43, 0.08);
}

.login-submit {
  width: 100%;
  justify-content: center;
}

.login-back {
  display: inline-block;
  margin-top: 24px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--blue);
}

.login-back:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-visual {
    min-height: clamp(220px, 34vh, 320px);
  }

  .login-visual__copy {
    justify-content: center;
    min-height: clamp(220px, 34vh, 320px);
    padding: 28px 24px;
  }

  .login-visual__title {
    font-size: clamp(1.6rem, 6vw, 2rem);
  }

  .login-visual__text {
    font-size: 0.92rem;
  }
}
</style>
