```js server
/* START - Rocket auto generated - do not touch */
export const sourceRelativeFilePath = '30--tools/40--check-html-links/10--overview.rocket.md';
import { html, layout } from '../../recursive.data.js';
export { html, layout };
/* END - Rocket auto generated - do not touch */

export const title = 'Check HTML links';
export const subTitle = 'A fast checker for broken links/references in HTML files';
```

# Overview

A fast checker for broken links/references in HTML files.

<inline-notification type="tip">

Read the [Introducing Check HTML Links - no more bad links](../../40--blog/001--introducing-check-html-links.rocket.md) Blog post to find out how it came to be and how it works.

</inline-notification>

## Features

- Checks all html files for broken local links/references (in href, src, srcset)
- Focuses on the broken reference targets and groups references to it
- Fast (can process 500-1000 documents in ~2-3 seconds)
- Has only 3 dependencies (and 19 in the full tree)
- Uses [sax-wasm](https://github.com/justinwilaby/sax-wasm) for parsing streamed HTML

## Installation

```shell
npm i -D check-html-links
```

## CLI flags

| Name                | Type    | Description                                                                                         |
| ------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| root-dir            | string  | the root directory to serve files from. Defaults to the current working directory                   |
| ignore-link-pattern | string  | do not check links matching the pattern                                                             |
| continue-on-error   | boolean | if present it will not exit with an error code - useful while writing or for temporary passing a ci |
| validate-externals  | boolean | if present it will validate external links making a request to the linked url                       |
| absolute-base-url   | string  | the urls of your website - if provided it will handle absolute links that start with it as internal |

## Usage Examples

```bash
# check a folder _site
npx check-html-links _site

# ignore all links like <a href="/users/123">
npx check-html-links _site --ignore-link-pattern "/users/*" "/users/**/*"

# ignore all links like <a href="/users/123"> & <a href="/users/123/details">
npx check-html-links _site --ignore-link-pattern "/users/*" "/users/**/*"

# check external urls
npx check-html-links _site --validate-externals

# check external urls but treat links like https://rocket.modern-web.dev/about/ as internal
npx check-html-links _site --validate-externals --absolute-base-url https://rocket.modern-web.dev
```

## Example Output

![Test Run Screenshot](./images/check-html-links-screenshot.png)

## Comparison

Checking the output of [11ty-website](https://github.com/11ty/11ty-website) with 13 missing reference targets (used by 516 links) while checking 501 files. (on January 17, 2021)

| Tool             | Lines printed | Times  | Lang | Dependency Tree |
| ---------------- | ------------- | ------ | ---- | --------------- |
| check-html-links | 38            | ~2.5s  | node | 19              |
| link-checker     | 3000+         | ~11s   | node | 106             |
| hyperlink        | 68            | 4m 20s | node | 481             |
| htmltest         | 1000+         | ~0.7s  | GO   | -               |
