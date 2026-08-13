<script setup lang="ts">
definePageMeta({layout: 'admin'})

const config = useRuntimeConfig()
const studioRoute = config.public.studio?.route || '/_studio'
const isDevStudio = Boolean(config.public.studio?.dev)

const status = ref<'loading' | 'ready' | 'auth'>('loading')
const bridgeError = ref('')
const previewPath = ref('/')
const activeTab = ref('Homepage')
const iframeKey = ref(0)
const isFullscreen = ref(false)

const previewSrc = computed(() => previewPath.value)

const contentAreas = [
  {label: 'Homepage', path: '/', hint: 'Hero, about, ministries, events sections'},
  {label: 'Site settings', path: '/', hint: 'Navigation, footer, contact info'},
  {label: 'Ministries', path: '/ministries', hint: 'Ministry pages and blurbs'},
  {label: 'Leadership', path: '/leadership', hint: 'Team bios and photos'},
  {label: 'Sermons', path: '/sermons', hint: 'Sermon posts and metadata'},
]

async function hasStudioSession() {
  try {
    const session = await $fetch<{user?: {email?: string}}>('/__nuxt_studio/auth/session')
    return Boolean(session?.user?.email)
  } catch {
    return false
  }
}

async function bridgeStudioSession() {
  bridgeError.value = ''
  try {
    await $fetch('/api/admin/studio-session', {method: 'POST'})
    return true
  } catch (error: unknown) {
    const err = error as {statusMessage?: string}
    bridgeError.value = err?.statusMessage || ''
    return false
  }
}

async function initEditor() {
  status.value = 'loading'

  if (isDevStudio || import.meta.dev) {
    status.value = 'ready'
    return
  }

  if (await hasStudioSession()) {
    status.value = 'ready'
    return
  }

  if (await bridgeStudioSession()) {
    status.value = 'ready'
    return
  }

  status.value = 'auth'
}

function openStudioAuth() {
  const redirect = encodeURIComponent('/admin/content')
  window.location.href = `${studioRoute}?redirect=${redirect}`
}

function setPreview(area: (typeof contentAreas)[number]) {
  previewPath.value = area.path
  activeTab.value = area.label
  iframeKey.value += 1
}

function reloadPreview() {
  iframeKey.value += 1
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function onFullscreenKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

watch(isFullscreen, (open) => {
  if (!import.meta.client) return

  if (open) {
    document.addEventListener('keydown', onFullscreenKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onFullscreenKeydown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', onFullscreenKeydown)
  document.body.style.overflow = ''
})

onMounted(() => {
  initEditor()
})

useSiteSeo({title: 'Content editor', description: 'Edit site content.', noindex: true})
</script>

<template>
  <div class="admin-page admin-page--content">
    <div class="admin-page-head">
      <div>
        <h1>Content</h1>
        <p class="admin-page-lead">
          Edit homepage sections, ministries, team bios, sermons, and site settings visually.
          Changes publish to GitHub and deploy on the next build.
        </p>
      </div>
      <div v-if="status === 'ready'" class="admin-page-actions">
        <button class="btn btn-ghost-dark" type="button" @click="reloadPreview">Reload preview</button>
        <button class="btn btn-ghost-dark" type="button" @click="toggleFullscreen">
          {{ isFullscreen ? 'Exit full screen' : 'Full screen' }}
        </button>
        <a class="btn btn-ghost-dark" :href="previewPath" target="_blank" rel="noopener">Open site</a>
      </div>
    </div>

    <div v-if="status === 'loading'" class="admin-panel">
      <p class="admin-empty">Loading content editor…</p>
    </div>

    <section v-else-if="status === 'auth'" class="admin-panel content-auth-panel">
      <div class="content-auth-copy">
        <h2>Connect to publish changes</h2>
        <p class="admin-meta">
          Sign in with GitHub to save content edits to the repository.
          Your admin login grants access to this page; GitHub auth is required to commit changes.
        </p>
        <p v-if="bridgeError" class="admin-error">{{ bridgeError }}</p>
        <button class="btn btn-primary" type="button" @click="openStudioAuth">
          Sign in with GitHub
        </button>
      </div>

      <div class="content-auth-list">
        <h3>What you can edit</h3>
        <ul>
          <li v-for="area in contentAreas" :key="area.label">
            <strong>{{ area.label }}</strong>
            <span>{{ area.hint }}</span>
          </li>
        </ul>
      </div>
    </section>

    <template v-else>
      <div class="content-editor-shell">
        <div class="content-editor-toolbar">
          <div class="content-editor-tabs">
            <button
              v-for="area in contentAreas"
              :key="area.label"
              class="content-editor-tab"
              :class="{active: activeTab === area.label}"
              type="button"
              @click="setPreview(area)"
            >
              {{ area.label }}
            </button>
          </div>
        </div>

        <p class="content-editor-hint admin-meta">
          Use the Studio panel inside the preview to edit content. Double-click page sections to jump to the matching file.
        </p>

        <div class="content-editor-frame-wrap" :class="{'is-fullscreen': isFullscreen}">
          <div v-if="isFullscreen" class="content-editor-frame-bar">
            <span class="content-editor-frame-label">{{ activeTab }}</span>
            <div class="content-editor-frame-actions">
              <button class="btn btn-ghost-dark" type="button" @click="reloadPreview">Reload</button>
              <button class="btn btn-ghost-dark" type="button" @click="toggleFullscreen">Exit full screen</button>
            </div>
          </div>

          <button
            v-else
            class="content-editor-fullscreen-btn"
            type="button"
            aria-label="Enter full screen"
            title="Full screen"
            @click="toggleFullscreen"
          >
            Full screen
          </button>

          <iframe
            :key="iframeKey"
            class="content-editor-frame"
            :src="previewSrc"
            title="Site content preview"
          />
        </div>
      </div>
    </template>
  </div>
</template>
