const env = {
  gitHubApiBase: import.meta.env.VITE_GITHUB_API_BASE,
  gitHubOrganization: import.meta.env.VITE_GITHUB_ORGANIZATION,
  gitHubRepository: import.meta.env.VITE_GITHUB_REPOSITORY,
  gitHubPagesBase: import.meta.env.VITE_GITHUB_PAGES_BASE,
  gitHubTokenLink: import.meta.env.VITE_GITHUB_TOKEN_LINK,
  slackTokenLink: import.meta.env.VITE_SLACK_TOKEN_LINK,

  routeBase: (new URL(import.meta.env.VITE_GITHUB_PAGES_BASE)).pathname,
} as const

export default env