/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = '40--blog/index.rocket.js';
import { html } from '../recursive.data.js';
export { html };
/* END - Rocket auto generated - do not touch */

import { LayoutMain } from '@rocket/launch';
import { layoutData } from '#src/layouts/layoutData.js';

export const menuLinkText = 'Blog';
export const layout = new LayoutMain({
  ...layoutData,
});

export default () => html`
  <rocket-content-area>
    <h1>Rocket Blog</h1>
    <p>
      Discover articles from the core team and contributors about Rocket, tips and tricks included!
    </p>

    <launch-blog-overview
      .pageTree=${layoutData.pageTree}
      .sourceRelativeFilePath=${sourceRelativeFilePath}
    >
    </launch-blog-overview>
  </rocket-content-area>
`;
