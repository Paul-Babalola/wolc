<script setup lang="ts">
const {state, accept, cancel} = useAdminConfirm()

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) cancel()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') cancel()
}

watch(
  () => state.open,
  (open) => {
    if (!import.meta.client) return

    if (open) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
)

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="state.open"
      class="admin-confirm-backdrop"
      role="presentation"
      @click="onBackdropClick"
    >
      <div
        class="admin-confirm-dialog"
        role="alertdialog"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-message"
        aria-modal="true"
      >
        <h2 id="admin-confirm-title" class="admin-confirm-title">{{ state.title }}</h2>
        <p id="admin-confirm-message" class="admin-confirm-message">{{ state.message }}</p>

        <div class="admin-confirm-actions">
          <button class="btn btn-ghost-dark" type="button" @click="cancel">
            {{ state.cancelLabel }}
          </button>
          <button
            class="btn"
            :class="state.variant === 'danger' ? 'btn-danger' : 'btn-primary'"
            type="button"
            @click="accept"
          >
            {{ state.confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
