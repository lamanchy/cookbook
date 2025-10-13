import test from 'node:test';
import assert from 'node:assert/strict';
import { filterRecipes } from '../assets/js/filters.js';

const sampleRecipes = [
  { title: 'Linecké', tags: ['vánoce'] },
  { title: 'Vanilkové rohlíčky', tags: ['vánoce', 'bez lepku'] },
  { title: 'Marokánky', tags: ['cukroví', 'ořechy'] },
];

test('keeps all recipes when no filters are applied', () => {
  const results = filterRecipes(sampleRecipes, '', []);

  assert.deepStrictEqual(results.map((recipe) => recipe.matches), [true, true, true]);
});

test('filters by partial search query', () => {
  const results = filterRecipes(sampleRecipes, 'rohl', []);

  assert.deepStrictEqual(results.map((recipe) => recipe.matches), [false, true, false]);
});

test('filters by tags with spaces in their names', () => {
  const results = filterRecipes(sampleRecipes, '', ['bez lepku']);

  assert.deepStrictEqual(results.map((recipe) => recipe.matches), [false, true, false]);
});

test('matches recipes that contain any of the selected tags', () => {
  const results = filterRecipes(sampleRecipes, '', ['bez lepku', 'ořechy']);

  assert.deepStrictEqual(results.map((recipe) => recipe.matches), [false, true, true]);
});

test('requires both search and tag filters to match', () => {
  const results = filterRecipes(sampleRecipes, 'linecké', ['bez lepku']);

  assert.deepStrictEqual(results.map((recipe) => recipe.matches), [false, false, false]);
});
