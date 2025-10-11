# Cookbook

Tento repozitář slouží jako statická kuchařka připravená pro GitHub Pages. Každý recept je samostatný Markdown soubor se štítky v kolekci [`_recipes/`](_recipes/). Úvodní stránka je generována pomocí Liquid šablon Jekyllu a umožňuje recepty filtrovat podle štítků i vyhledávat podle názvu.

## Struktura projektu

- [`_config.yml`](_config.yml) – nastavení Jekyllu včetně kolekce `recipes`.
- [`_layouts/`](_layouts/) – základní layout webu (`default`) a šablona pro jednotlivé recepty (`recipe`).
- [`_recipes/`](_recipes/) – Markdown soubory jednotlivých receptů, každý obsahuje YAML front matter s názvem (`title`) a štítky (`tags`).
- [`index.html`](index.html) – domovská stránka, která vygeneruje seznam receptů přes Liquid, nabídne filtry a vyhledávání.
- [`assets/styles.css`](assets/styles.css) – společné styly webu.

## Nasazení na GitHub Pages

1. V nastavení repozitáře na GitHubu otevřete **Settings → Pages**.
2. Jako zdroj (Build and deployment → Source) zvolte větev `main` a kořenový adresář (`/`). GitHub automaticky sestaví Jekyll web.
3. Po dokončení sestavení bude stránka dostupná na adrese poskytované GitHubem. Na hlavní stránce můžete recepty filtrovat zaškrtnutím štítků nebo vyhledáním textu.

Pro lokální náhled je možné použít Jekyll: `bundle exec jekyll serve`. (Instalace Ruby a bundleru není součástí tohoto repozitáře.)

- [Vánoční recepty](christmas/README.md)
