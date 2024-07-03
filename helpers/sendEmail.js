import ElasticEmail from '@elasticemail/elasticemail-client';
import "dotenv/config";

const { ELASTICEMAIL_API_KEY, ELASTICEMAIL_FROM } = process.env;

const defaultClient = ElasticEmail.ApiClient.instance;
const { apikey } = defaultClient.authentications;
apikey.apiKey = ELASTICEMAIL_API_KEY;

const api = new ElasticEmail.EmailsApi();

const sendEmail = async ({ to, subject, body }) => {
    const email = ElasticEmail.EmailMessageData.constructFromObject({
        Recipients: [
            new ElasticEmail.EmailRecipient({ Email: to }) 
        ],
        Content: {
            Body: [
                ElasticEmail.BodyPart.constructFromObject({
                    ContentType: "HTML",
                    Content: body
                })
            ],
            Subject: subject,
            From: ELASTICEMAIL_FROM
        }
    });

    return new Promise((resolve, reject) => {
        api.emailsPost(email, (error, data, response) => {
            if (error) {
                console.error("Error sending email:", error.message);
                if (error.response) {
                    console.error("API Response Status:", error.response.status);
                    console.error("API Response Body:", error.response.body);
                } else {
                    console.error("No response from API:", error);
                }
                reject(error);
            } else {
                console.log('Email sent successfully.');
                console.log("API Response:", response);
                resolve(response);
            }
        });
    });
};

export default sendEmail;







