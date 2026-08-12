<script setup lang="ts">
useSiteSeo({
  title: 'Privacy Policy',
  description: 'How RCCG Word of Life Center collects, uses, and protects your information.',
})
</script>

<template>
  <div>
    <PageHeader
      title="Privacy Policy"
      lead="Last updated: August 2026"
      :crumbs="[{label: 'Home', href: '/'}, {label: 'Privacy Policy'}]"
    />

    <section class="block block-tight">
      <div class="wrap legal">
        <p>
          RCCG Word of Life Center ("we," "our," or "the church") respects your privacy.
          This policy explains what we collect through our website and how we use it.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>Contact details you submit (name, email, phone) on contact, prayer, RSVP, or newsletter forms.</li>
          <li>Prayer request content you choose to share, including private requests visible only to our prayer team.</li>
          <li>Basic technical data such as browser type and IP address for security and abuse prevention.</li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to messages, prayer requests, event RSVPs, and newsletter signups.</li>
          <li>To notify designated church staff by email when a form is submitted.</li>
          <li>To protect our site from spam and abuse (rate limiting and automated checks).</li>
        </ul>

        <h2>Sharing</h2>
        <p>
          We do not sell your personal information. Form data is stored in our secure database
          (Supabase) and may be emailed to authorized church staff. Email delivery is handled by
          our notification provider (Resend).
        </p>

        <h2>Retention</h2>
        <p>
          We retain submissions as long as needed to serve you and operate the ministry.
          You may request deletion of your data by contacting
          <a href="mailto:admin@rccgwordoflifecenter.org">admin@rccgwordoflifecenter.org</a>.
        </p>

        <h2>Cookies &amp; third parties</h2>
        <p>
          Our site may load fonts from Google Fonts and embed videos from YouTube or Facebook.
          Online giving may redirect to PayPal. Those services have their own privacy policies.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy?
          <NuxtLink to="/contact">Contact us</NuxtLink>
          or email
          <a href="mailto:admin@rccgwordoflifecenter.org">admin@rccgwordoflifecenter.org</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.legal {
  max-width: 720px;
  color: var(--ink-2);
  line-height: 1.7;
}

.legal h2 {
  font-family: var(--display);
  font-size: 1.25rem;
  margin: 28px 0 10px;
  color: var(--ink);
}

.legal ul {
  padding-left: 1.2rem;
  margin-bottom: 12px;
}

.legal a {
  color: var(--blue);
  font-weight: 600;
}
</style>
