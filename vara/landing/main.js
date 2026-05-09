/**
 * Vara landing — waitlist signup
 *
 * Without an endpoint (default): validates email, shows thank-you (no network).
 * Production: set window.VARA_WAITLIST_ENDPOINT to your Formspree form URL
 * (e.g. "https://formspree.io/f/xxxx") or any endpoint that accepts POST form data
 * with fields: email, _subject (optional). We also send waitlist=yes for compatibility.
 */
(function () {
  const form = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('email');
  const submitBtn = document.getElementById('submit-btn');
  const formError = document.getElementById('form-error');
  const formPanel = document.getElementById('form-panel');
  const successPanel = document.getElementById('success-panel');

  const endpoint =
    typeof window.VARA_WAITLIST_ENDPOINT === 'string' && window.VARA_WAITLIST_ENDPOINT.trim()
      ? window.VARA_WAITLIST_ENDPOINT.trim()
      : '';

  function showError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.classList.add('is-visible');
  }

  function clearError() {
    if (!formError) return;
    formError.textContent = '';
    formError.classList.remove('is-visible');
  }

  function isValidEmail(value) {
    const v = value.trim();
    if (!v) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function showSuccess() {
    if (formPanel) formPanel.style.display = 'none';
    if (successPanel) successPanel.classList.add('is-visible');
  }

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearError();

    const email = emailInput ? emailInput.value : '';

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      if (emailInput) emailInput.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      if (endpoint) {
        const body = new FormData();
        body.append('email', email.trim());
        body.append('waitlist', 'yes');
        body.append('_subject', 'Vara — Waitlist');

        const res = await fetch(endpoint, {
          method: 'POST',
          body,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          throw new Error('Request failed');
        }
      }

      showSuccess();
    } catch (err) {
      showError('Something went wrong. Please try again in a moment.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join the list';
      }
    }
  });
})();
