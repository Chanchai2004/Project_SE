import emailjs from 'emailjs-com';

interface SendEmailParams {
  email: string;
  username: string;
  password: string;
  subject: string;
  lastname: string;
  firstname: string;
  lastname2: string;
  firstname2: string;
}

const sendEmail = ({
  email,
  username,
  password,
  subject,
  lastname,
  firstname,
  lastname2,
  firstname2,
}: SendEmailParams) => {
  // EmailJS service ID, template ID, and public key
  const serviceId = 'service_3k1k81u';
  const templateId = 'template_kjo9scr';
  const publicKey = 'V34aqR-Ji5BBq7ofQ';

  // Define the hospital name
  const hospital = 'โรงพยาบาลเทพสิริ';

  // Pass template parameters to EmailJS
  const templateParams = {
    to_name: email,
    from_name: subject,
    hospital,
    firstname,
    lastname,
    username,
    password,
    firstname2,
    lastname2,
  };

  // Send email using EmailJS
  emailjs
    .send(serviceId, templateId, templateParams, publicKey)
    .then((response) => {
      console.log('Email sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};

export default sendEmail;
