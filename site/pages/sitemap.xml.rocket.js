/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = 'sitemap.xml.rocket.js';
import { html } from './recursive.data.js';
export { html };
/* END - Rocket auto generated - do not touch */

import { LayoutSitemap } from '@rocket/engine';

import { pageTree } from '#src/layouts/layoutData.js';
import rocketConfig from '../../config/rocket.config.js';

export const layout = new LayoutSitemap({
  pageTree,
  absoluteBaseUrl: rocketConfig.absoluteBaseUrl,
});

export default () => '';
