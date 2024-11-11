import React, { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  Select,
  Upload,
  Modal,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { IEmployee } from "../../interfaces/IEmployee";
import {
  createEmployee,
  listGenders,
  listPositions,
  listDepartments,
  listStatuses,
  listSpecialists,
} from "../../services/https";
import { useNavigate, Link } from "react-router-dom";
import type { UploadFile, UploadProps } from "antd";
import moment from "moment";

const { Option } = Select;

const Admin1: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [genders, setGenders] = useState([]);
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [specialists, setSpecialists] = useState([]);

  const fetchData = async () => {
    const genderRes = await listGenders();
    if (genderRes) setGenders(genderRes);

    const positionRes = await listPositions();
    if (positionRes) setPositions(positionRes);

    const departmentRes = await listDepartments();
    if (departmentRes) setDepartments(departmentRes);

    const statusRes = await listStatuses();
    if (statusRes) setStatuses(statusRes);

    const specialistRes = await listSpecialists();
    if (specialistRes) setSpecialists(specialistRes);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Limit to 1 file
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
  
    // จัดรูปแบบข้อมูลก่อนส่งไปยัง API
    const formattedValues = {
      first_name: values.FirstName,         // first_name
      last_name: values.LastName,           // last_name
      age: Number(values.Age),              // age
      // แก้ไขวันที่ให้เป็นรูปแบบ ISO 8601
      date_of_birth: values.DateOfBirth.format("YYYY-MM-DDTHH:mm:ssZ"),  // date_of_birth
      email: values.Email,                  // email
      phone: values.Phone,                  // phone
      address: values.Address,              // address
      username: values.Username,            // username
      professional_license: values.ProfessionalLicense,  // professional_license
      graduate: values.Graduate,            // graduate
      password: values.Password,            // password
      gender_id: values.GenderID,           // gender_id
      position_id: values.PositionID,       // position_id
      department_id: values.DepartmentID,   // department_id
      status_id: values.StatusID,           // status_id
      specialist_id: values.SpecialistID,   // specialist_id
      profile: fileList[0]?.thumbUrl || "", // profile (base64 image)
    };
  
    // ตรวจสอบข้อมูลที่กำลังจะส่งไป API
    console.log("Formatted data being sent to API:", formattedValues);
  
    try {
      const result = await createEmployee(formattedValues);
  
      // พิมพ์ผลลัพธ์จาก backend ใน console เพื่อดูว่ามีอะไรส่งกลับมาบ้าง
      console.log("Response from API:", result); // แสดงผลลัพธ์ที่ได้รับจาก API
  
      // ตรวจสอบผลลัพธ์จาก API
      if (result.status === 201) {
        // ตรวจสอบข้อความที่ส่งจาก backend
        if (result.data && result.data.message === "Created success") {
          message.success("Employee created successfully!");
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        } else {
          message.error("Failed to create employee.");
        }
      } else {
        // กรณีที่ไม่เป็นสถานะ 201
        message.error("Failed to create employee.");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error occurred:", error);
      message.error("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div>
      <Card>
        <h2>ลงทะเบียนพนักงาน</h2>
        <Divider />
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item label="รูปประจำตัว" name="Profile">
                <ImgCrop rotationSlider>
                  <Upload
                    fileList={fileList}
                    onChange={onChange}
                    maxCount={1}
                    listType="picture-card"
                    onPreview={onPreview}
                  >
                    {fileList.length < 1 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>อัพโหลด</div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ชื่อจริง"
                name="FirstName"
                rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="นามสกุล"
                name="LastName"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="อายุ"
                name="Age"
                rules={[{ required: true, message: "กรุณากรอกอายุ!" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="วันเกิด"
                name="DateOfBirth"
                rules={[{ required: true, message: "กรุณาเลือกวันเกิด!" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="อีเมล"
                name="Email"
                rules={[{ required: true, message: "กรุณากรอกอีเมล!" }]}
              >
                <Input type="email" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="Phone"
                rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ที่อยู่"
                name="Address"
                rules={[{ required: true, message: "กรุณากรอกที่อยู่!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ชื่อผู้ใช้งาน"
                name="Username"
                rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้งาน!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="รหัสผ่าน"
                name="Password"
                rules={[
                  { required: true, message: "กรุณากรอกรหัสผ่าน!" },
                  { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ใบประกอบวิชาชีพ"
                name="ProfessionalLicense"
                rules={[{ required: true, message: "กรุณากรอกใบประกอบวิชาชีพ!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ระดับการศึกษา"
                name="Graduate"
                rules={[{ required: true, message: "กรุณากรอกระดับการศึกษา!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="เพศ"
                name="GenderID"
                rules={[{ required: true, message: "กรุณาเลือกเพศ!" }]}
              >
                <Select placeholder="กรุณาเลือกเพศ">
                  {genders.map((gender) => (
                    <Option key={gender.ID} value={gender.ID}>
                      {gender.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ตำแหน่ง"
                name="PositionID"
                rules={[{ required: true, message: "กรุณาเลือกตำแหน่ง!" }]}
              >
                <Select placeholder="เลือกตำแหน่ง">
                  {positions.map((position) => (
                    <Option key={position.ID} value={position.ID}>
                      {position.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="แผนก"
                name="DepartmentID"
                rules={[{ required: true, message: "กรุณากรอกแผนก!" }]}
              >
                <Select placeholder="เลือกแผนก">
                  {departments.map((department) => (
                    <Option key={department.ID} value={department.ID}>
                      {department.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="สถานะ"
                name="StatusID"
                rules={[{ required: true, message: "กรุณากรอกสถานะ!" }]}
              >
                <Select placeholder="เลือกสถานะ">
                  {statuses.map((status) => (
                    <Option key={status.ID} value={status.ID}>
                      {status.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="ผู้เชี่ยวชาญ"
                name="SpecialistID"
                rules={[{ required: true, message: "กรุณากรอกผู้เชี่ยวชาญ!" }]}
              >
                <Select placeholder="เลือกผู้เชี่ยวชาญ">
                  {specialists.map((specialist) => (
                    <Option key={specialist.ID} value={specialist.ID}>
                      {specialist.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center" style={{ marginTop: 16 }}>
            <Space>
              <Link to="/employee">
                <Button htmlType="button" style={{ backgroundColor: "#e0dede" }}>
                  ยกเลิก
                </Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "rgb(218, 165, 32)" }}
                loading={isSubmitting}
              >
                ยืนยัน
              </Button>
            </Space>
          </Row>
        </Form>
      </Card>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="profile" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default Admin1;