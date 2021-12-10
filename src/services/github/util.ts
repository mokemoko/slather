import type { Feed } from '../../models/feed'
import env from '../../utils/env'

export const apiPath4content = (feed: Feed) => [
  'repos',
  env.gitHubOrganization,
  env.gitHubRepository,
  'contents',
  `docs/_feeds/${feed.created_ms}.json`,
].join('/')

export const feedTemplate = (feed: Feed) => {
  return `---
title: ${JSON.stringify(feed.title)}
description: ${JSON.stringify(feed.description)}
author: ${feed.author_id}
created: ${feed.created_ms}
---
${JSON.stringify(feed, null, 2)}
`
}
