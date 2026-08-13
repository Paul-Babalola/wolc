<script setup lang="ts">
definePageMeta({ layout: "admin" });

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

const { confirm: confirmAction } = useAdminConfirm();

const deletingId = ref<string | null>(null);
const actionError = ref("");

const {
  data: subscribers,
  pending,
  error,
  refresh,
} = await useFetch<Subscriber[]>("/api/admin/newsletter-subscribers", {
  default: () => [],
});

async function removeSubscriber(item: Subscriber) {
  const ok = await confirmAction({
    title: "Remove subscriber",
    message: `Remove ${item.email} from the newsletter list?`,
    confirmLabel: "Remove",
    variant: "danger",
  });
  if (!ok) return;

  deletingId.value = item.id;
  actionError.value = "";

  try {
    await $fetch(`/api/admin/newsletter-subscribers/${item.id}`, {
      method: "DELETE",
    });
    await refresh();
  } catch (err: any) {
    actionError.value = err?.statusMessage || "Could not remove subscriber.";
  } finally {
    deletingId.value = null;
  }
}

function exportCsv() {
  const rows = [
    ["Email", "Joined"],
    ...(subscribers.value || []).map((item) => [
      item.email,
      formatAdminWhen(item.created_at),
    ]),
  ];
  downloadCsv("wolc-newsletter-subscribers.csv", rows);
}

useSiteSeo({
  title: "Newsletter subscribers",
  description: "Staff newsletter list.",
  noindex: true,
});
</script>

<template>
  <div class="admin-page">
    <div class="admin-page-head">
      <div>
        <h1>Newsletter</h1>
        <p class="admin-page-lead">
          Email addresses collected from the footer signup and other newsletter
          forms.
        </p>
      </div>
      <div class="admin-page-actions">
        <button class="btn btn-ghost-dark" type="button" @click="refresh()">
          Refresh
        </button>
        <button class="btn btn-ghost-dark" type="button" @click="exportCsv">
          Export CSV
        </button>
      </div>
    </div>

    <section class="admin-panel">
      <div class="admin-panel-head">
        <h2>Subscribers</h2>
        <span class="admin-count">{{ subscribers?.length || 0 }}</span>
      </div>

      <p v-if="actionError" class="admin-error">{{ actionError }}</p>
      <p v-if="error" class="admin-error">Could not load subscribers.</p>
      <p v-else-if="pending" class="admin-empty">Loading…</p>
      <p v-else-if="!subscribers?.length" class="admin-empty">
        No subscribers yet.
      </p>

      <ul v-else class="admin-list">
        <li v-for="item in subscribers" :key="item.id" class="admin-list-item">
          <div>
            <div class="admin-list-title-row">
              <h3>{{ item.email }}</h3>
            </div>
            <p class="admin-meta">
              Joined: {{ formatAdminWhen(item.created_at) }}
            </p>
          </div>

          <div class="admin-actions-col">
            <button
              class="admin-text-btn danger"
              type="button"
              :disabled="deletingId === item.id"
              @click="removeSubscriber(item)"
            >
              {{ deletingId === item.id ? "Removing…" : "Remove" }}
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
