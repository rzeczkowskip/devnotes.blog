---
title: Cloudflare Pages - deploy using GitHub Actions
date: 2023-06-04
categories: [tools]
tags: [github actions, cloudflare, static site, site generators, ci/cd]
summary: >-
    Taking control over the process of publishing a website on Cloudflare Pages. Talking about workflow configuration,
    building and publishing website using GitHub Actions.
langs:
    pl: /posty/cloudflare-pages-github-actions/
---

Cloudflare Pages allows to create a website directly from a git repository (GitHub, GitLab). Been there, seen that, works fine, but... Yeah, but. I decided to store more than one site in a single repository. In that case, the flow provided by Cloudflare isn't enough.

> Monorepos or repositories with multiple codebases/applications currently cannot use the automatic GitHub/GitLab
> integration to build multiple sites from the same repository. However, Direct Uploads can be used to upload a monorepo
> as separate Pages projects from your own computer.

 I had to take control of the build and push to CF process. GitHub Actions, [cloudflare/pages-action](https://github.com/cloudflare/pages-action) to be more specific, is a perfect match for that task.

The process looks like this:

1. Build the page
2. Push to Cloudflare
3. Profit

Easy, isn't it? The build step is different on project-by-project basis, so we won't cover it here. It doesn't matter if you're using Next.js, Hugo or other StaticSiteGeneratorUltimate, the important part are the generated files.

# Configuration

## Cloudflare Pages project

We need a project created in Cloudflare Pages. It should be configured as "direct upload". The "Connect to Git" option doesn't work for us, since we want to push files ourselves. In the end, you're taking the control of it.

## Cloudflare's Account ID and API Token

The page project is there, not access keys: Account ID and API Token:

**Account ID** can be found on sidebar once you select any of the configured websites or go to the list of Pages in Cloudflare's dashboard. It's also available in the URL once you log in.

**API Token** has to be generated manually:

1. Go to "My Profile", then to "API tokens" in Cloudflare's dashboard.
2. Pick a "custom token" option.
3. In "Account Resources" pick "Cloudflare Pages" with "Edit" access.
4. The rest doesn't matter.

Store both values as secrets in your repository.

# Action

```yaml
name: Deploy

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # build page in ./out

      - uses: cloudflare/pages-action@1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: CF-PROJECT-NAME
          directory: out
```

That's all. In the past you had to configure the `@cloudflare/wrangler` action manually. Today the configuration above is enough.

The `apiToken` and `accountId` variables used in action are the keys created in previous steps. `projectName` is well... Project name from Cloudflare's dashboard (name, not id or other hash). `directory` it directory, where the build site files are located. Files from that directory will be pushed to CF (in the above example it's `out`).

```yaml
apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
projectName: CF-PROJECT-NAME
directory: out
```

> [!info] Production example
> This blog, at the day of writing the post, is managed by the presented action. If you want to see how it works, take a look at [deploy.yml workflow](https://github.com/rzeczkowskip/devnotes.blog/blob/main/.github/workflows/deploy.yml) in DevNotes repository.
