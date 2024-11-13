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

const sendEmail = ({ email, username, password, subject ,lastname ,firstname, lastname2,firstname2}: SendEmailParams) => {
  // Your EmailJS service ID, template ID, and Public Key
  const serviceId = 'service_3k1k81u';
  const templateId = 'template_kjo9scr';
  const publicKey = 'V34aqR-Ji5BBq7ofQ';

  const hospital = 'โรงพยาบาลตัวอย่าง'; // Set hospital name globally or dynamically
  const templateParams = {
    from_name: subject,
    to_name: email, // You can customize this or pass dynamically if needed
    message: `เรียนคุณ ${firstname} ${lastname}\n\nยินดีต้อนรับสู่โรงพยาบาล ${hospital}!\nเพื่อให้คุณสามารถเริ่มต้นใช้งานระบบของโรงพยาบาลได้ เราได้จัดเตรียมข้อมูลบัญชีผู้ใช้งานของคุณดังนี้:\n\nUsername: ${username}\nPassword: ${password}\n\nกรุณาเข้าสู่ระบบผ่านลิงก์ด้านล่าง:\n[URL http://localhost:5174/login ]\n\nเมื่อเข้าสู่ระบบครั้งแรก เราขอแนะนำให้คุณเปลี่ยนรหัสผ่านเพื่อความปลอดภัยของบัญชีของคุณเอง และหากพบปัญหาหรือข้อสงสัยในการใช้งาน กรุณาติดต่อฝ่าย IT ที่ [อีเมลหรือเบอร์โทรฝ่าย IT]\n\nเราหวังว่าจะได้ร่วมงานกับคุณและช่วยให้คุณมีประสบการณ์การทำงานที่ดีในองค์กรของเรา\n\nขอแสดงความนับถือ,\n\n${firstname2} ${lastname2}\n\nฝ่ายทรัพยากรบุคคล\nโรงพยาบาล ${hospital}\n[เบอร์โทรหรืออีเมลสำหรับติดต่อกลับ]`,
  };

  // Send the email using EmailJS
  emailjs
    .send(serviceId, templateId, templateParams, publicKey)
    .then((response) => {
      console.log('Email sent successfully!', response);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};

export default sendEmail;
