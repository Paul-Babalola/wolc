<script setup lang="ts">
definePageMeta({ layout: "admin" });

interface ContactMessage {
  id: string;
  kind: "contact" | "connect";
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  handled_at: string | null;
  created_at: string;
}

const { confirm: confirmAction } = useAdminConfirm();

const tab = ref<"all" | "contact" | "connect">("all");
const updatingId = ref<string | null>(null);
const actionError = ref("");

const query = computed(() => (tab.value === "all" ? {} : { kind: tab.value }));

const {
  data: messages,
  pending,
  error,
  refresh,
} = await useFetch<ContactMessage[]>("/api/admin/contact-messages", {
  query,
  default: () => [],
});

async function toggleHandled(item: ContactMessage) {
  const isHandled = !!item.handled_at;
  const ok = await confirmAction({
    title: isHandled ? "Reopen message" : "Mark as handled",
    message: isHandled
      ? `Reopen the message from ${item.name}? It will show as open again.`
      : `Mark the message from ${item.name} as handled?`,
    confirmLabel: isHandled ? "Reopen" : "Mark handled",
  });
  if (!ok) return;

  updatingId.value = item.id;
  actionError.value = "";

  try {
    await $fetch(`/api/admin/contact-messages/${item.id}`, {
      method: "PATCH",
      body: { handled: !item.handled_at },
    });
    await refresh();
  } catch (err: any) {
    actionError.value = err?.statusMessage || "Could not update message.";
  } finally {
    updatingId.value = null;
  }
}

useSiteSeo({ title: "Inbox", description: "Staff inbox.", noindex: true });
</script>

<template>
  <div class="admin-page">
    <div class="admin-page-head">
      <div>
        <h1>Inbox</h1>
        <p class="admin-page-lead">
          Contact form submissions and connect-card messages from the public
          site.
        </p>
      </div>
      <div class="admin-page-actions">
        <button class="btn btn-ghost-dark" type="button" @click="refresh()">
          Refresh
        </button>
      </div>
    </div>

    <div class="admin-tabs">
      <button
        class="admin-tab"
        :class="{ active: tab === 'all' }"
        type="button"
        @click="tab = 'all'"
      >
        All
      </button>
      <button
        class="admin-tab"
        :class="{ active: tab === 'contact' }"
        type="button"
        @click="tab = 'contact'"
      >
        Contact
      </button>
      <button
        class="admin-tab"
        :class="{ active: tab === 'connect' }"
        type="button"
        @click="tab = 'connect'"
      >
        Connect
      </button>
    </div>

    <section class="admin-panel">
      <div class="admin-panel-head">
        <h2>Messages</h2>
        <span class="admin-count">{{ messages?.length || 0 }}</span>
      </div>

      <p v-if="actionError" class="admin-error">{{ actionError }}</p>
      <p v-if="error" class="admin-error">Could not load inbox messages.</p>
      <p v-else-if="pending" class="admin-empty">Loading…</p>
      <p v-else-if="!messages?.length" class="admin-empty">No messages yet.</p>

      <ul v-else class="admin-list">
        <li v-for="item in messages" :key="item.id" class="admin-list-item">
          <div>
            <div class="admin-list-title-row">
              <h3>{{ item.name }}</h3>
              <span
                class="admin-pill"
                :class="item.handled_at ? 'muted' : 'warn'"
              >
                {{ item.handled_at ? "Handled" : "Open" }}
              </span>
              <span class="admin-pill info">{{ item.kind }}</span>
            </div>
            <p class="admin-meta">
              <a :href="`mailto:${item.email}`">{{ item.email }}</a>
              <span v-if="item.phone"> · {{ item.phone }}</span>
            </p>
            <p class="admin-meta">
              Received: {{ formatAdminWhen(item.created_at) }}
            </p>
            <p v-if="item.message" class="admin-message">{{ item.message }}</p>
          </div>

          <div class="admin-actions-col">
            <button
              class="admin-text-btn"
              type="button"
              :disabled="updatingId === item.id"
              @click="toggleHandled(item)"
            >
              {{
                updatingId === item.id
                  ? "Saving…"
                  : item.handled_at
                    ? "Reopen"
                    : "Mark handled"
              }}
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
