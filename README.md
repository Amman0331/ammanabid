# Amman Abid’s portfolio

A standalone HTML, CSS and JavaScript portfolio with an animated avatar, scroll-driven chapters, a horizontal work gallery and optional sound. Images, icons and fonts are included.

## Upload to GitHub

1. Extract the ZIP on your computer.
2. Create a new repository at https://github.com/new. You can name it `amman-abid-portfolio`.
3. On the repository page, choose **uploading an existing file** or **Add file → Upload files**.
4. Drag the entire `public` folder, `vercel.json` and this `README.md` into the upload area. Commit the files to `main`.
5. Check that the homepage appears at `public/index.html` and the configuration file appears at `vercel.json` in the repository root.

## Connect the repository to Vercel

1. Open https://vercel.com/new and sign in. Connect your GitHub account, grant access to this repository and select **Import**.
2. Leave **Root Directory** at `./`. The included configuration selects a static deployment, skips installation and build commands, and serves `public`. If the dashboard asks for a framework preset, choose **Other**.
3. Select **Deploy**. Open the production URL that Vercel gives you and try **Work**, a project card and **Contact**.
4. To update the portfolio, edit the repository and commit to the production branch. Vercel deploys connected Git updates automatically.

## Edit or preview locally

- Edit `public/index.html` for the text, avatar and social links.
- Edit `public/site.css` for colours, typography and layout.
- Edit `public/studio.js` for project details, chapter timings and interaction.
- Keep images and fonts in `public/assets/`.

With Python 3 installed, run `python -m http.server 8000 --directory public` from the repository root. Open http://localhost:8000.

[Vercel GitHub integration](https://vercel.com/docs/git/vercel-for-github) · [Vercel build settings](https://vercel.com/docs/builds/configure-a-build)
