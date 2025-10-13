# Local preview checklist

To preview the cookbook site with full styling:

1. Ensure Ruby and the `jekyll` CLI are available. On a fresh container run:
   ```sh
   gem install bundler jekyll
   ```
2. From the repository root start the development server with the production base URL so links match GitHub Pages:
   ```sh
   jekyll serve --baseurl "/cookbook" --host 0.0.0.0
   ```
   * The repository now uses the standard `_config.yml` and `_layouts/` directories that GitHub Pages picks up automatically.
   * Supplying `--baseurl "/cookbook"` locally mirrors the deployed path and keeps asset URLs identical.
3. Visit `http://127.0.0.1:4000/cookbook/` (or the host/port shown in the terminal). You should see the gradient page background and styled typography from `assets/css/style.css`, confirming the CSS was loaded.
4. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal to stop the server when you are done.

These steps mirror the GitHub Pages production setup while keeping the local preview fully styled.
