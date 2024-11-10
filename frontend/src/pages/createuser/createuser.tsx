import React, { useState, useEffect } from 'react';
import { createEmployee, listGenders, listPositions, listDepartments, listStatuses, listSpecialists } from '../../services/https/index';
import { IEmployee } from '../../interfaces/IEmployee';
import { Form, Input, Button, Select, DatePicker, InputNumber, notification } from 'antd';

const { Option } = Select;

const CreateUser: React.FC = () => {
  const [employee, setEmployee] = useState<IEmployee>({
    firstName: '',
    lastName: '',
    age: 0,
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    genderID: 0,
    positionID: 0,
    departmentID: 0,
    statusID: 0,
    specialistID: 0,
    password: '',
  });

  const [genders, setGenders] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [specialists, setSpecialists] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setGenders(await listGenders());
      setPositions(await listPositions());
      setDepartments(await listDepartments());
      setStatuses(await listStatuses());
      setSpecialists(await listSpecialists());
    }
    fetchData();
  }, []);

  const handleChange = (name: string, value: any) => {
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    console.log('Employee data to be sent:', employee); // Log ข้อมูลที่จะส่ง

    const result = await createEmployee(employee);
    if (result) {
      notification.success({
        message: 'Success',
        description: 'Employee created successfully!',
      });
      // Optionally, reset the form or redirect
    } else {
      notification.error({
        message: 'Error',
        description: 'Failed to create employee. Please check your input.',
      });
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Create Employee</h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="First Name" required>
          <Input
            name="firstName"
            value={employee.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="First Name"
          />
        </Form.Item>

        <Form.Item label="Last Name" required>
          <Input
            name="lastName"
            value={employee.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Last Name"
          />
        </Form.Item>

        <Form.Item label="Age" required>
          <InputNumber
            min={1}
            value={employee.age}
            onChange={(value) => handleChange('age', value)}
            placeholder="Age"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Date of Birth" required>
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date) => handleChange('dateOfBirth', date ? date.toISOString() : '')}
          />
        </Form.Item>

        <Form.Item label="Email" required>
          <Input
            type="email"
            name="email"
            value={employee.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item label="Phone" required>
          <Input
            name="phone"
            value={employee.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Phone"
          />
        </Form.Item>

        <Form.Item label="Address" required>
          <Input
            name="address"
            value={employee.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Address"
          />
        </Form.Item>

        <Form.Item label="Password" required>
          <Input.Password
            name="password"
            value={employee.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item label="Gender" required>
          <Select
            value={employee.genderID}
            onChange={(value) => handleChange('genderID', value)}
            placeholder="Select Gender"
          >
            {genders.map((gender: any) => (
              <Option key={gender.ID} value={gender.ID}>
                {gender.GenderName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Position" required>
          <Select
            value={employee.positionID}
            onChange={(value) => handleChange('positionID', value)}
            placeholder="Select Position"
          >
            {positions.map((position: any) => (
              <Option key={position.ID} value={position.ID}>
                {position.PositionName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Department" required>
          <Select
            value={employee.departmentID}
            onChange={(value) => handleChange('departmentID', value)}
            placeholder="Select Department"
          >
            {departments.map((department: any) => (
              <Option key={department.ID} value={department.ID}>
                {department.DepartmentName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Status" required>
          <Select
            value={employee.statusID}
            onChange={(value) => handleChange('statusID', value)}
            placeholder="Select Status"
          >
            {statuses.map((status: any) => (
              <Option key={status.ID} value={status.ID}>
                {status.StatusName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Specialist" required>
          <Select
            value={employee.specialistID}
            onChange={(value) => handleChange('specialistID', value)}
            placeholder="Select Specialist"
          >
            {specialists.map((specialist: any) => (
              <Option key={specialist.ID} value={specialist.ID}>
                {specialist.SpecialistName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUser;
