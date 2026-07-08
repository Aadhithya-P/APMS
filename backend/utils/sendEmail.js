const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendEmail = async ({
  email,
  subject,
  message,
}) => {

  const { data, error } =
    await resend.emails.send({

      from:
        "NestHub <onboarding@resend.dev>",

      to: email,

      subject,

      html: message,

    });

  if (error) {

    console.error(error);

    throw new Error(error.message);

  }

  console.log(
    "Email sent successfully:",
    data
  );

};

module.exports = sendEmail;