# Duolingo Streak Keeper

[![Keep my Duolingo streak](https://github.com/KalanyAmr/Duolingo/actions/workflows/streak-keeper.yml/badge.svg)](https://github.com/KalanyAmr/Duolingo/actions/workflows/streak-keeper.yml)

<img src="duo.svg" width="128px"/>

Streak keeper and XP farm for Duolingo. Never get demoted again!

Based on [rfoel/duolingo](https://github.com/rfoel/duolingo).

### How to use

1. Go to [Duolingo](https://www.duolingo.com)
2. While logged in, open the browser's console (Option (⌥) + Command (⌘) + J on macOS, or Shift + CTRL + J on Windows/Linux)
3. Get the JWT token by pasting this in the console, and copy the value (without the surrounding `'`):

```js
document.cookie
  .split(';')
  .find(cookie => cookie.includes('jwt_token'))
  .split('=')[1]
```

4. In this repository, go to Settings > Secrets and variables > Actions, and click `New repository secret`
5. Name the secret `DUOLINGO_JWT` and paste the value copied in step 3
6. Go to the Actions tab and enable workflows if they aren't enabled yet

## Workflows

### 🔥 Streak Keeper

A scheduled GitHub Actions workflow runs once a day at a random time between 22:00 and 23:00 Israel time (DST-aware) and completes 5 practice sessions to keep the streak alive and earn XP. A keepalive step prevents GitHub from disabling the schedule after 60 days of repository inactivity, so it keeps running on its own indefinitely. If a run fails (for example because the JWT expired), the workflow turns red and GitHub notifies you by email. See [.github/workflows/streak-keeper.yml](.github/workflows/streak-keeper.yml).

### 📚 Study

This repository can also "study" lessons for you to earn XP. It is triggered manually via [workflow_dispatch](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch), and you can choose the number of lessons to complete. See [.github/workflows/study.yml](.github/workflows/study.yml).

## Caveats

- This project won't help with daily or friend quests; it can only earn XP to move up the league rank.
- It doesn't do real lessons or stories, only practices, so it won't affect your learning path.
- The JWT token expires eventually — if the workflow starts failing, grab a fresh token and update the secret.

## Running as a standalone script

You can also run the script locally. Put `DUOLINGO_JWT=...` in an `.env` file and run:

```
node --env-file=.env index.js
```

> Node v20.6.0 or later is needed for the `--env-file` flag.

Or pass the variable inline:

```
DUOLINGO_JWT=... node index.js
```
