# Arifa — Portfolio

This repository contains a small, responsive portfolio website scaffold built for deployment to GitHub Pages.

Files added:
- `index.html` — main site
- `styles.css` — styles
- `assets/profile.svg` — placeholder avatar

To view locally, open `index.html` in your browser or run a simple static server. For example (Python 3):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Deploy to GitHub Pages:

1. Create a new repository on GitHub (for user page use `username.github.io`).
2. Push this folder to that repo's `main` branch.

```bash
git init
git add .
git commit -m "Initial portfolio scaffold"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. In the repository settings on GitHub, enable Pages from the `main` branch (root). GitHub will publish the site at `https://YOUR_USERNAME.github.io/YOUR_REPO/` (or `https://YOUR_USERNAME.github.io/` for a user repo).

Customize content (name, email, projects) inside `index.html` and update `assets/profile.svg` as needed.
