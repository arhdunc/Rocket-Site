```js server
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = '10--docs/index.rocket.md';
import { html, layout } from '../recursive.data.js';
export { html, layout };
/* END - Rocket auto generated - do not touch */

import { pageTree } from '#src/layouts/layoutData.js';
import { ChildListMenu } from '@rocket/engine';

export const menuLinkText = 'Docs';
export const subTitle = 'From zero to hero';
```

# Learning Rocket

Rocket helps you generate static pages from Markdown files while giving you the flexibility to sprinkle in some JavaScript where needed.

<div>${pageTree.renderMenu(new ChildListMenu(), sourceRelativeFilePath)}</div>
