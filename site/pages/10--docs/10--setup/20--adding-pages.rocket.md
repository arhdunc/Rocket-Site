```js server
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = '10--docs/10--setup/20--adding-pages.rocket.md';
import { html, layout } from '../../recursive.data.js';
export { html, layout };
/* END - Rocket auto generated - do not touch */
```

# Adding Pages

<inline-notification type="warning">

You can do this whole part of the tutorial in a couple minutes. It's almost _**too**_ fast.

It can help to examine each new page and menu carefully, to come to terms with the implicit navigation created by your addition of new content, at least the first couple of times.

</inline-notification>

## Start the engines

Before we get started we need to engage the engines via

```
npm start
```

This will start rocket in development mode and you will see your site running in your browser.

## What is a page?

A page is a file that ends either with `*.rocket.js`, `*.rocket.md` or `*.rocket.html` and is located in the input directory (`site/pages` by default). Pages will make up the majority of your website.

The simplest way to get started is to create a file

👉 `site/pages/index.rocket.md`

```md
# Hello World

You can read all about...
```

If you now open the site in your browser you will see "Hello World".

## Page header

Now if you check your source file you will see an see an auto generated section at the top of your file that will look something like this

````md
```js server
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = 'index.rocket.md';
/* END - Rocket auto generated - do not touch */
```
````

This section will be used to auto inject settings and data via a data cascade.

To test it you can create a file

👉 `site/pages/recursive.data.js`

```js
import { html } from 'lit';

export const layout = data => html`
  <!DOCTYPE html>
  <html>
    <body>
      <header>My Website</header>
      <div>${data.content()}</div>
    </body>
  </html>
`;
```

Now if you go back to your `site/pages/index.rocket.md` you will see that `layout` got automatically injected.

````md
```js server
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = 'index.rocket.md';
import { layout } from './recursive.data.js';
export { layout };
/* END - Rocket auto generated - do not touch */
```
````

The rules are as follows:

- Every export of a `recursive.data.js` & `local.data.js` will get injected into effected pages.
- `recursive.data.js` will get injected into all pages in the current folder and all sub folders.
- `local.data.js` will get injected into all pages in the current folder.
- Data files closer to the page will override data files further away.
- `local.data.js` will override `recursive.data.js` values

This can be very useful for setting global values like a default layout or to automatically have `html` injected into your pages.
