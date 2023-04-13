export function extractUrl(body: string): string | null {
  if (typeof body !== 'string') {
    return "Input is not a string";
  }

  const urlRegex = /https?:\/\/\S+[\w/]/g;
  const matches = body.match(urlRegex);

  if (matches) {
    // Remove any trailing punctuation marks from the URL
    const url = matches[0].replace(/[.,;!?"')\]]+$/, '');
    return url;
  }

  return null;
}

export function excludePublished(issues: any) {
  return issues.data.filter((issue: any) => {
    const hasSlackPublishedLabel = issue.labels.some(
      (label: string | {
        name?: string | undefined;
      }) => {
        if (typeof label === "object" && label.name === "slack-published") {
          return true;
        }
        return false;
      }
    );
    return !hasSlackPublishedLabel;
  });
}