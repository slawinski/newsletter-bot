import { Octokit } from "@octokit/rest";
import { NextApiRequest, NextApiResponse } from "next";
import { extractUrl } from "./utils/issues.util";
import { WebClient } from "@slack/web-api";
import * as cheerio from "cheerio";
import fetch from "node-fetch"; // Use node-fetch instead of request-promise

// Store environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL || "default-channel";

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const web = new WebClient(SLACK_TOKEN);

async function getUserName(userId: string) {
  try {
    const userInfoResponse = await web.users.info({ user: userId });

    if (userInfoResponse.ok && userInfoResponse.user?.profile) {
      return (
        userInfoResponse.user.profile.display_name_normalized ||
        userInfoResponse.user.name
      );
    } else {
      console.error(
        "Failed to fetch user information from Slack API.",
        userInfoResponse.error
      );
      return JSON.stringify(userInfoResponse, null, 2);
    }
  } catch (error) {
    console.error("Error fetching user information from Slack API:", error);
    return userId; // Return the user ID if an error occurs
  }
}

async function getOgDescription(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const ogDescription = $('meta[property="og:description"]').attr("content");

    return ogDescription || "no description available";
  } catch (error) {
    console.error("Error fetching OG description:", error);
    return "no description available";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id, text } = req.body;

  try {
    const url = extractUrl(text);

    if (!url) {
      res.status(400).json({ error: "Invalid URL provided." });
      return;
    }

    const userName = await getUserName(user_id);
    const ogDescription = await getOgDescription(url);

    const githubResponse = await octokit.issues.create({
      owner: `${GITHUB_REPO_OWNER}`,
      repo: `${GITHUB_REPO_NAME}`,
      title: `Issue created by ${userName}`,
      labels: ["slack-published"],
      body: `${url}\n${ogDescription}`,
    });

    if (githubResponse.status === 201) {
      const message = `<@${user_id}> went on the internet the other day and found this: ${url}`;

      await web.chat.postMessage({
        channel: SLACK_CHANNEL,
        text: message,
      });

      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to create a GitHub issue." });
    }
  } catch (error) {
    console.error("An error occurred while processing the request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
}
