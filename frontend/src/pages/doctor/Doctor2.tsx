import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Card, Row, Col } from 'antd';

const { Option } = Select;

const Doctor2: React.FC = () => {
  const [form] = Form.useForm();
  const [submittedData, setSubmittedData] = useState(null);

  const onFinish = (values: any) => {
    setSubmittedData(values); // แสดงข้อมูลที่กรอกเมื่อส่งฟอร์มสำเร็จ
    console.log('Received values:', values);
  };

  return (
    <Card title="Jajajaja" style={{ width: '100%' }}>
      <Form
        form={form}
        name="doctor-info"
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: 600, margin: 'auto' }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input placeholder="Enter your first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input placeholder="Enter your last name" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please select your gender' }]}
        >
          <Select placeholder="Select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: 'Please select your date of birth' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Specialization"
          name="specialization"
          rules={[{ required: true, message: 'Please enter your specialization' }]}
        >
          <Input placeholder="Enter your specialization" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input.TextArea placeholder="Enter your address" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      {/* แสดงข้อมูลที่กรอกเมื่อฟอร์มถูกส่ง */}
      {submittedData && (
        <Card title="Submitted Data" style={{ marginTop: 20 }}>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </Card>
      )}
    </Card>
  );
};

export default Doctor2;
