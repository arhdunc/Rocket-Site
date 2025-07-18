```js server
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = '10--docs/30--guides/95--deploy.rocket.md';
import { html, layout } from '../../recursive.data.js';
export { html, layout };
/* END - Rocket auto generated - do not touch */
```

# Deploying Rocket

---

### Github Pages

The [Rocket Starter](../10--setup/10--getting-started.rocket.md) ships with GitHub Pages integration set up by default.
You will find the file at

```
my-project
├── .github
│   └── workflows
│       └── github-build-and-deploy-rocket-action.yml
├── site/*
└── package.json
```

This means to go live with a freshly created Rocket project hosted on GitHub you need to change the Repository's Settings following these steps:

1. After pushing your generated Rocket project to GitHub, navigate to the `Settings` -tab in your repository.
2. From this tab, select the side navigation option `Pages`.
3. In your `Pages` -page, set the `Source` option to the newly generated `gh-pages` -branch, leaving the directory as `/ (root)`.
4. Save your Settings.

**And you're done!**

Your page should now appear hosted in `https://yourusername.github.io/your-repository/` in the following minutes.

You won't need to worry about any deployments either. Rocket will automatically handle deployments from your main branch onto the newly published
GitHub pages every time you push your code.

---
