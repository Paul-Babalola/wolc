<script setup lang="ts">
definePageMeta({layout: 'admin'})

const supabase = useSupabaseClient()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

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

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin/events'
  await navigateTo(redirect)
}

useSeoMeta({title: 'Admin sign in', robots: 'noindex, nofollow'})
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <p class="login-eyebrow">Word of Life Center</p>
      <h1>Admin sign in</h1>
      <p class="login-lead">Sign in with your authorized staff account to manage events.</p>

      <form class="form-stack" @submit.prevent="signIn">
        <label>
          <span class="field-label">Email</span>
          <input
            v-model="email"
            class="form-field"
            type="email"
            autocomplete="email"
            required
          >
        </label>

        <label>
          <span class="field-label">Password</span>
          <input
            v-model="password"
            class="form-field"
            type="password"
            autocomplete="current-password"
            required
          >
        </label>

        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background: linear-gradient(180deg, var(--paper) 0%, #eef2ff 100%);
}

.login-card {
  width: min(100%, 420px);
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  box-shadow: 0 18px 50px rgba(26, 26, 26, 0.06);
}

.login-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}

h1 {
  font-family: var(--display);
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  margin-bottom: 8px;
}

.login-lead {
  color: var(--muted);
  margin-bottom: 24px;
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
}
</style>
