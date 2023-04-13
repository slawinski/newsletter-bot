import { Octokit } from '@octokit/rest';
import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import { extractUrl, excludePublished } from './utils/issues.util';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const web = new WebClient(process.env.SLACK_TOKEN);

async function postIssuesOnSlack(_req: any, res: any) {
  try {
    const issues = await octokit.issues.listForRepo({
      owner: `${process.env.GITHUB_REPO_OWNER}`,
      repo: `${process.env.GITHUB_REPO_NAME}`,
      state: 'open',
      sort: 'updated',
      direction: 'desc',
    });

    // below is a work-around for excluding issues with given label
    const filteredIssues = excludePublished(issues);

    for (const issue of filteredIssues) {
      const url = extractUrl(issue.body ?? 'no body');

      if (url) {
        const message = `${issue.user?.login} has shared ${url}`;
        await web.chat.postMessage({
          channel: process.env.SLACK_CHANNEL ?? 'default-channel',
          text: message,
        });

        await octokit.issues.addLabels({
            owner: 'slawinski',
            repo: 'newsletter-bot',
            issue_number: issue.number,
            labels: ['slack-published'],
          });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default postIssuesOnSlack;


