# Serverless function to post GitHub issues to Slack

This is a simple serverless function built with Next.js that uses the GitHub REST API to retrieve issues and posts them to a Slack channel using the Slack Web API.

## Prerequisites

Create a slackbot in your slack workspace.

## Configuration

The function expects the following environment variables to be set:

- `GITHUB_TOKEN`: A personal access token for GitHub with the `repo` scope and read/write permission for issues.
- `SLACK_TOKEN`: A Slack Bot token with the `chat:write` scope.
- `SLACK_CHANNEL`: The ID of the Slack channel where messages should be posted.

The function is deployed on Vercel as a serverless function (also known as "edge functions"), and is scheduled using a cron job to run every day between 8 am and 9 am CET.

## Code

The function code is located in `./api/handler.ts`. It uses the following dependencies:

- `@octokit/rest` for interacting with the GitHub API.
- `@slack/web-api` for interacting with the Slack API.
- `dotenv` for loading environment variables from a `.env` file.

The function retrieves a list of open issues from a specified GitHub repository using the `listForRepo` method of the `Octokit` client, filters out any issues that have already been published to Slack using a label, and posts a message to Slack for each remaining issue using the `postMessage` method of the `WebClient` client. Finally, the function adds a `slack-published` label to each issue that was published to Slack using the `addLabels` method of the `Octokit` client.

## Deployment

The function is deployed on Vercel using the following steps:

1. Fork the repository to your own GitHub account.
2. Create a new project on Vercel, and link it to your forked repository.
3. Set the environment variables in the Vercel dashboard.

## Usage

To use the function, simply run the function URL `/api/handler` in your browser, use a tool like `curl` to make a GET request to the URL or trigger the cron job in the Vercel dashboard. The function will retrieve the latest issue updates and post them to Slack.
