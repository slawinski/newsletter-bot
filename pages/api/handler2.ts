export default async function handler(req: any, res: any) {
    const { response_url, user_id } = req.body;

    try {
        const headers = {
            Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
            "Content-type": "application/json",
        };

        let raw = `{
            response_type: "in_channel",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "Hello, <@${user_id}>! I'm Mr. Meeseeks! Look at me!",
                    },
                },
            ],
            text: "Hello, I'm Mr. Meeseeks! Look at me!",
        }`;

        const requestOptions = {
            method: "POST",
            headers,
            body: raw,
        };

        await fetch(`${response_url}`, requestOptions);
        res.status(200).end();
    } catch (error) {
        console.log(error);
    }
}