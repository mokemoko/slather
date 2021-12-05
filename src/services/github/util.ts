import { Feed, feedVM2feed } from '../../models/feed'

export const apiPath4content = (feed: Feed) => [
  'repos',
  import.meta.env.VITE_GITHUB_ORGANIZATION,
  import.meta.env.VITE_GITHUB_REPOSITORY,
  'contents',
  `docs/_feeds/${feed.created_ms}.json`,
].join('/')

export const feedTemplate = (feed: Feed) => {
  return `---
title: ${feed.title}
description: ${feed.description}
author: ${feed.author_id}
created: ${feed.created_ms}
---
${JSON.stringify(feed, null, 2)}
`
}
