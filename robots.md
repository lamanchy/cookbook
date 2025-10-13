# Local preview checklist

To preview the cookbook site with full styling:

1. Ensure Ruby and the `jekyll` CLI are available. On a fresh container run:
   ```sh
   gem install bundler jekyll
   ```
2. From the repository root start the development server with the custom configuration and layout directory:
   ```sh
   jekyll serve --config config.yml --layouts layouts --baseurl "" --host 0.0.0.0
   ```
   * `--config config.yml` picks up the repository's `config.yml` (GitHub Pages does this automatically).
   * `--layouts layouts` tells Jekyll to look in the `layouts/` folder instead of the default `_layouts/`.
   * `--baseurl ""` is required locally so the CSS served from `/assets/css/style.css` resolves correctly.
3. Visit `http://127.0.0.1:4000/` (or the host/port shown in the terminal). You should see the gradient page background and styled typography from `assets/css/style.css`, confirming the CSS was loaded.
4. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal to stop the server when you are done.

These steps mirror the GitHub Pages production setup while keeping the local preview fully styled.
