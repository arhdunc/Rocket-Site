```js server
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = '30--tools/20--markdown-javascript/30--story.rocket.md';
import { html, layout } from '../../recursive.data.js';
export { html, layout };
/* END - Rocket auto generated - do not touch */
```

# Story

You can showcase live running code by annotating a code block with `js story`.

```js client
import { html } from '@mdjs/mdjs-story';
```

````md
```js client
import { html } from '@mdjs/mdjs-story';
```

```js story
export const foo = () => html` <p>my html</p> `;
```
````

will result in

```js story
export const foo = () => html` <p>my html</p> `;
```
