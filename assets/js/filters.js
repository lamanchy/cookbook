document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('#search-input');
  const tagButtons = Array.from(document.querySelectorAll('[data-filter-tag]'));
  const cards = Array.from(document.querySelectorAll('.recipe-card'));
  const emptyMessage = document.querySelector('.no-results');

  const selectedTags = new Set();

  function normalise(text) {
    return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  }

  function updateFilters() {
    const query = searchInput ? normalise(searchInput.value.trim()) : '';

    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.dataset.title || '';
      const text = card.dataset.text || '';
      const tags = (card.dataset.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const matchesQuery = !query || normalise(title).includes(query) || normalise(text).includes(query);
      const matchesTags = selectedTags.size === 0 || Array.from(selectedTags).every((tag) => tags.includes(tag));

      if (matchesQuery && matchesTags) {
        card.hidden = false;
        card.classList.remove('is-hidden');
        visibleCount += 1;
      } else {
        card.hidden = true;
        card.classList.add('is-hidden');
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  function toggleTag(button) {
    const tag = button.dataset.filterTag;
    if (!tag) return;

    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
      button.classList.remove('active');
      button.setAttribute('aria-pressed', 'false');
    } else {
      selectedTags.add(tag);
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    }
    updateFilters();
  }

  searchInput?.addEventListener('input', updateFilters);

  tagButtons.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => toggleTag(button));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleTag(button);
      }
    });
  });

  updateFilters();
});
