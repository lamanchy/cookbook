const normalize = (value) => value.toString().trim().toLowerCase();

const parseTags = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((tag) => normalize(tag))
      .filter((tag) => tag.length > 0);
  }

  const raw = value.toString();
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    parsed = raw.split(/\s+/).filter(Boolean);
  }

  if (parsed == null) {
    return [];
  }

  if (typeof parsed === 'string') {
    parsed = [parsed];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((tag) => normalize(tag))
    .filter((tag) => tag.length > 0);
};

export function filterRecipes(recipes, query, requiredTags = []) {
  const normalizedQuery = normalize(query || '');
  const normalizedRequired = (requiredTags || [])
    .map((tag) => normalize(tag))
    .filter((tag) => tag.length > 0);

  return recipes.map((recipe) => {
    const normalizedTitle = normalize(recipe.title || '');
    const normalizedTags = parseTags(recipe.tags);

    const matchesText = normalizedQuery.length === 0 || normalizedTitle.includes(normalizedQuery);
    const matchesTags =
      normalizedRequired.length === 0 ||
      normalizedRequired.some((tag) => normalizedTags.includes(tag));

    return {
      ...recipe,
      matches: matchesText && matchesTags,
      tags: normalizedTags,
      title: normalizedTitle,
    };
  });
}

export function setupRecipeFilters(root = document) {
  const boxes = Array.from(root.querySelectorAll('.tagbox'));
  const search = root.getElementById('search');
  const items = Array.from(root.querySelectorAll('#recipe-list .recipe'));
  const emptyState = root.getElementById('empty-state');

  const recipes = items.map((li) => ({
    element: li,
    title: li.dataset.title || '',
    tags: li.dataset.tags,
  }));

  function applyFilters() {
    const query = search?.value || '';
    const requiredTags = boxes
      .filter((box) => box.checked)
      .map((box) => box.value || '');

    const filtered = filterRecipes(recipes, query, requiredTags);

    let visibleCount = 0;

    filtered.forEach((result) => {
      const isVisible = result.matches;

      result.element.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    return visibleCount;
  }

  boxes.forEach((box) => box.addEventListener('change', applyFilters));
  if (search) {
    search.addEventListener('input', applyFilters);
  }

  applyFilters();

  return { applyFilters };
}
