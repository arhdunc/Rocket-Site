```js server
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = '10--docs/20--basics/30--data-cascade.rocket.md';
import { html, layout } from '../../recursive.data.js';
export { html, layout };
/* END - Rocket auto generated - do not touch */
```

# Data Cascade

For most pages you probably don't want to explicitly define a layout. It would mean a lot of boilerplate code.
To avoid that you can use the **data cascade** feature.

The whole cascade works via 5 mechanics

1. The automatically injected page header
2. The `local.data.js` file to define data for pages within this folder
3. The `recursive.data.js` file to define data for this folder and all sub folders
4. That data files closer to the page will override data files further away
5. That `local.data.js` will override `recursive.data.js` values

## How does it work?

Create a file `site/pages/recursive.data.js` and put the following code in it:

```js
import { MyLayout } from '...';

export layout = new MyLayout();
```

with that every page will get the following header:

```js
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = '/path/to/file.md';
import { layout } from '../path/to/recursive.data.js';
export { layout };
/* END - Rocket auto generated - do not touch */
```

and by doing so each page uses the same layout.

## Override

Often a single layout for all pages in a website will not be enough.

For that reasons you can override the layout via exporting `layout` on a specific page or by placing additional data files in nested folders.

```
.
├── pages
│   ├── blog
│   │   ├── index.rocket.js
│   │   ├── introducing-rocket.rocket.md
│   │   ├── local.data.js                  <-- sets blog layout for all pages in this folder
│   │   └── new-look.rocket.md
│   ├── docs
│   │   ├── codelabs
│   │   │   ├── getting-started.rocket.md
│   │   │   ├── local.data.js              <-- sets a codelabs layout for all pages in this folder
│   │   │   └── styling.rocket.md
│   │   ├── setup
│   │   │   ├── environment.rocket.md      <-- no explicit layout so use the default
│   │   │   ├── index.rocket.js
│   │   │   └── node.rocket.md
│   │   └── index.rocket.js
│   ├── index.rocket.js                    <-- explicitly has `export const layout = LayoutHome()` to set a layout only for this page
│   └── recursive.data.js                  <-- defines the default layout
└── public
```

In the above example we have 4 layouts we define in different places.

1. Default layout used by all pages unless overwritten in `recursive.data.js`
2. Explicitly specifying a layout `index.rocket.js`
3. use `blog/local.data.js` to set a layout for all pages in `blog`
4. use `docs/codelabs/local.data.js` to set a layout for all pages in `codelabs`
