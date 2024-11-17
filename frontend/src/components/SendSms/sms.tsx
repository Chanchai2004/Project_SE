import axios from 'axios';


const sendSmsNotification = async (email, phone) => {
  try {
    // Display sending status
    console.log('Sending SMS...');

    // Send data to backend
    const response = await axios.post('http://localhost:4001/proxy/send-sms', {
      msisdn: phone,
      message: `เรียนพนักงานใหม่ ข้อมูลสำหรับการเข้าสู่ระบบ (Username และ Password) ได้ถูกส่งไปยังอีเมลของท่าน: ${email} แล้ว โปรดตรวจสอบใน Inbox หรือ Spam หากไม่พบ ติดต่อฝ่ายบุคคล ขอบคุณ`,
    
    });

    console.log('SMS sent successfully:', response.data);
    return 'SMS sent successfully!';
  } catch (error) {
    console.error('Failed to send SMS:', error.response?.data || error.message);
    throw new Error('Failed to send SMS.');
  }
};

export default sendSmsNotification;
