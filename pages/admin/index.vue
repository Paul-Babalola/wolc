<script setup lang="ts">
import type { AdminStats } from "~/composables/useAdminNav";

definePageMeta({ layout: "admin" });

const {
  data: stats,
  pending,
  error,
  refresh,
} = await useFetch<AdminStats>("/api/admin/stats", {
  default: () => ({
    events: { total: 0, upcoming: 0 },
    rsvps: { week: 0, total: 0, recurringWeek: 0 },
    inbox: { unhandled: 0, week: 0 },
    prayer: { unhandled: 0, week: 0 },
    newsletter: { total: 0, week: 0 },
  }),
});

useSiteSeo({
  title: "Admin dashboard",
  description: "Staff dashboard.",
  noindex: true,
});
</script>

<template>
  <div class="admin-page admin-page--dashboard">
    <div class="admin-page-head">
      <div>
        <h1>Dashboard</h1>
        <p class="admin-page-lead">
          Manage events, review submissions, and keep up with registrations.
        </p>
      </div>
      <div class="admin-page-actions">
        <button
          class="btn btn-ghost-dark"
          type="button"
          :disabled="pending"
          @click="refresh()"
        >
          Refresh
        </button>
      </div>
    </div>

    <p v-if="error" class="admin-error">
      Could not load dashboard stats. Check Supabase and run migration 0005 if
      inbox or prayer counts fail.
    </p>

    <div class="admin-stats-grid">
      <article class="admin-stat-card admin-stat-card--events">
        <div class="admin-stat-top">
          <span class="admin-stat-icon"><AdminIcon name="events" /></span>
          <p class="admin-stat-label">Upcoming events</p>
        </div>
        <p class="admin-stat-value">{{ stats?.events.upcoming ?? 0 }}</p>
        <p class="admin-stat-meta">
          {{ stats?.events.total ?? 0 }} saved total
        </p>
      </article>

      <article class="admin-stat-card admin-stat-card--rsvps">
        <div class="admin-stat-top">
          <span class="admin-stat-icon"><AdminIcon name="rsvps" /></span>
          <p class="admin-stat-label">RSVPs this week</p>
        </div>
        <p class="admin-stat-value">{{ stats?.rsvps.week ?? 0 }}</p>
        <p class="admin-stat-meta">
          {{ stats?.rsvps.total ?? 0 }} one-off total
        </p>
      </article>

      <article class="admin-stat-card admin-stat-card--inbox">
        <div class="admin-stat-top">
          <span class="admin-stat-icon"><AdminIcon name="inbox" /></span>
          <p class="admin-stat-label">Unhandled inbox</p>
        </div>
        <p class="admin-stat-value">{{ stats?.inbox.unhandled ?? 0 }}</p>
        <p class="admin-stat-meta">
          {{ stats?.inbox.week ?? 0 }} new this week
        </p>
      </article>

      <article class="admin-stat-card admin-stat-card--prayer">
        <div class="admin-stat-top">
          <span class="admin-stat-icon"><AdminIcon name="prayer" /></span>
          <p class="admin-stat-label">Open prayer requests</p>
        </div>
        <p class="admin-stat-value">{{ stats?.prayer.unhandled ?? 0 }}</p>
        <p class="admin-stat-meta">
          {{ stats?.prayer.week ?? 0 }} new this week
        </p>
      </article>

      <article class="admin-stat-card admin-stat-card--newsletter">
        <div class="admin-stat-top">
          <span class="admin-stat-icon"><AdminIcon name="newsletter" /></span>
          <p class="admin-stat-label">Newsletter subscribers</p>
        </div>
        <p class="admin-stat-value">{{ stats?.newsletter.total ?? 0 }}</p>
        <p class="admin-stat-meta">
          {{ stats?.newsletter.week ?? 0 }} joined this week
        </p>
      </article>
    </div>

    <section class="admin-panel">
      <div class="admin-panel-head">
        <h2>Content editing</h2>
      </div>
      <p class="admin-meta">
        Edit homepage sections, ministries, team bios, sermons, and site settings with Nuxt Studio.
        Changes publish to GitHub and deploy on the next build.
      </p>
      <NuxtLink class="btn btn-primary content-editor-link" to="/admin/content">
        Open content editor
      </NuxtLink>
    </section>
  </div>
</template>
