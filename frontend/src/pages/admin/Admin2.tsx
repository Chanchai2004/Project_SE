import React, { useState, useEffect } from "react";
import ImgCrop from "antd-img-crop";
import Papa from "papaparse";
import sendEmail from "../../components/SendEmail/email_register";
import { Table, Input, Modal, Upload, Typography, Form, DatePicker, Select, Row, Col, Button, Space, message } from "antd";
import { UploadOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import type { UploadFile, UploadProps } from "antd";
import {
  createEmployee,
  listGenders,
  listPositions,
  listDepartments,
  listStatuses,
  listSpecialists,
  listBloodGroups,
  listDiseases,
  getEmployeeById,
} from "../../services/https";

const { Text } = Typography;
const { Option } = Select;

const ReadCSV: React.FC = () => {
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
  const [bloodGroups, setBloodGroups] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [columns, setColumns] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // ดึงข้อมูลจาก API และ localStorage เมื่อหน้าโหลด
    const fetchData = async () => {
      try {
        const [genderRes, positionRes, departmentRes, statusRes, specialistRes, bloodGroupRes, diseaseRes] = await Promise.all([
          listGenders(),
          listPositions(),
          listDepartments(),
          listStatuses(),
          listSpecialists(),
          listBloodGroups(),
          listDiseases(),
        ]);
  
        setGenders(genderRes || []);
        setPositions(positionRes || []);
        setDepartments(departmentRes || []);
        setStatuses(statusRes || []);
        setSpecialists(specialistRes || []);
        setBloodGroups(bloodGroupRes || []);
        setDiseases(diseaseRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const fetchEmployeeData = async () => {
      try {
        const employeeId = localStorage.getItem("id");
        if (employeeId) {
          const employee = await getEmployeeById(employeeId);
          if (employee) {
            form.setFieldsValue({
              FirstName: employee.first_name,
              LastName: employee.last_name,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    
  
    // ดึงข้อมูลตารางจาก localStorage
    const loadUploadedRows = () => {
      try {
        const storedRows = localStorage.getItem("uploadedRows");
        if (storedRows) {
          const parsedRows = JSON.parse(storedRows);
    
          // ตั้งค่า columns ใหม่อีกครั้ง
          setColumns([
            { title: "First Name", dataIndex: "firstname", key: "firstname" },
            { title: "Last Name", dataIndex: "lastname", key: "lastname" },
            { title: "Status", dataIndex: "status", key: "status" },
          ]);
    
          // ตั้งค่า rows
          setRows(parsedRows);
        } else {
          console.log("No uploaded rows found in localStorage.");
        }
      } catch (error) {
        console.error("Error loading uploaded rows from localStorage:", error);
      }
    };
    
  
    // เรียกใช้ฟังก์ชันทั้งหมดเมื่อ component ถูก mount
    fetchData();
    fetchEmployeeData();
    loadUploadedRows();
  }, [form]);
  
  
  const normalizeKey = (key: string) => key.trim().toLowerCase();
  
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
  
  
  
  const handleFileUpload = (file: File) => {
    if (file.type !== "text/csv") {
      message.error("Please upload a valid CSV file.");
      return false;
    }
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length === 0) {
          const data = result.data as any[];
          if (data.length > 0) {
            const normalizedData = data.map((row) =>
              Object.keys(row).reduce((acc, key) => {
                acc[normalizeKey(key)] = row[key];
                return acc;
              }, {} as any)
            );
  
            const cleanData = normalizedData.map((row) => ({
              ...row,
              status: row.firstname && row.lastname ? "Ready" : "Not Ready",
            }));
  
            setColumns([
              { title: "First Name", dataIndex: "firstname", key: "firstname" },
              { title: "Last Name", dataIndex: "lastname", key: "lastname" },
              { title: "Status", dataIndex: "status", key: "status" },
            ]);
  
            setRows(cleanData);
  
            // เก็บข้อมูลใน localStorage
            localStorage.setItem("uploadedRows", JSON.stringify(cleanData));
          } else {
            message.warning("No data found in the file.");
          }
        } else {
          message.error("Error parsing CSV.");
        }
      },
    });
  
    return false;
  };
  
  

  const showModal = (row: any) => {
    setFormData(row);
    form.setFieldsValue(row);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    const formValues = form.getFieldsValue();
    const updatedRows = rows.map((row) =>
      row.firstname === formData.firstname && row.lastname === formData.lastname
        ? { ...row, ...formValues }
        : row
    );
    setRows(updatedRows);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      const formattedValues = {
        first_name: values.FirstName,
        last_name: values.LastName,
        date_of_birth: values.DateOfBirth.format("YYYY-MM-DD"),
        email: values.Email,
        phone: values.Phone,
        address: values.Address,
        username: values.Username,
        professional_license: values.ProfessionalLicense,
        graduate: values.Graduate,
        password: values.Password,
        gender_id: values.GenderID,
        position_id: values.PositionID,
        department_id: values.DepartmentID,
        status_id: values.StatusID,
        specialist_id: values.SpecialistID,
        profile: fileList[0]?.thumbUrl || "",
        blood_group_id: values.BloodGroupID,
        diseases: values.Diseases || [],
      };

      const result = await createEmployee(formattedValues);
      if (result.status === 201) {
        //sendEmail({ email: values.Email, username: values.Username });
        message.success("Data saved successfully!");
        navigate("/admin");
      } else {
        message.error("Error saving data.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <h1 style={{ textAlign: "center", color: "#1890ff" }}>Upload and Manage Data</h1>
  
      {/* Search and Upload Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Input
            placeholder="Search by Name"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col span={12}>
          <Upload beforeUpload={handleFileUpload} accept=".csv" showUploadList={false}>
            <Button type="primary" icon={<UploadOutlined />}>
              Upload CSV
            </Button>
          </Upload>
        </Col>
      </Row>
  
      {/* Data Table */}
      <Table
  dataSource={rows.filter(
    (row) =>
      row.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
  )}
  columns={columns}
  rowKey={(record, index) => index.toString()} // ใช้ index เป็น unique key
  pagination={{ pageSize: 5 }}
  locale={{
    emptyText: "No Data Available",
  }}
  onRow={(record) => ({
    onClick: () => {
      console.log("Row clicked:", record); // Debug: Log clicked row
      showModal(record); // Show modal with record data
    },
  })}
  bordered
  style={{
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  }}
/>

  
      {/* Edit Modal */}
      <Modal
        title="Edit Row Details"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        width="90%" // กำหนดความกว้างเป็น 80% ของหน้าจอ
      > 
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

            <Col span={4}>
              <Form.Item
                label="วันเกิด"
                name="DateOfBirth"
                rules={[{ required: true, message: "กรุณาเลือกวันเกิด!" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>


            <Col span={8}>
              <Form.Item
                label="หมายเลขบัตรประชาชน"
                name="NationalID"
                rules={[
                  { required: true, message: "กรุณากรอกหมายเลขบัตรประชาชน!" },
                  {
                    pattern: /^[0-9]{13}$/,
                    message: "หมายเลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก!",
                  },
                ]}
              >
                <Input placeholder="กรุณากรอกหมายเลขบัตรประชาชน" maxLength={13} />
              </Form.Item>
            </Col>



            <Col span={8}>
              <Form.Item
                label="อีเมล"
                name="Email"
                rules={[
                  { required: true, message: "กรุณากรอกอีเมล!" },
                  { type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง!" },
                ]}
              >
                <Input placeholder="กรุณากรอกอีเมล" />
              </Form.Item>
            </Col>


            <Col span={4}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="Phone"
                rules={[
                  { required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก!",
                  },
                ]}
              >
                <Input placeholder="กรุณากรอกเบอร์โทรศัพท์" maxLength={10} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="เพศ"
                name="GenderID"
                rules={[{ required: true, message: "กรุณาเลือกเพศ!" }]}
              >
                <Select placeholder="กรุณาเลือกเพศ">
                  {genders.map((gender) => (
                    <Option key={gender.ID} value={gender.ID}>
                      {gender.gender_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="กรุ๊ปเลือด"
                name="BloodGroupID"
                rules={[{ required: true, message: "กรุณาเลือกกรุ๊ปเลือด!" }]}
              >
                <Select placeholder="กรุณาเลือกกรุ๊ปเลือด">
                  {bloodGroups.map((bloodGroup) => (
                    <Option key={bloodGroup.ID} value={bloodGroup.ID}>
                      {bloodGroup.blood_group}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="โรคประจำตัว"
                name="Diseases"
                rules={[{ required: false, message: "กรุณาเลือกโรคประจำตัว!" }]}
              >
                <Select
                  mode="multiple" // อนุญาตให้เลือกหลายค่า
                  placeholder="เลือกโรคประจำตัว"
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {diseases.map((disease) => (
                    <Option key={disease.ID} value={disease.ID}>
                      {disease.disease_name}
                    </Option>
                  ))}
                </Select>
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
                rules={[
                  { required: true, message: "กรุณากรอกใบประกอบวิชาชีพ!" },
                  {
                    pattern: /^[A-Za-z0-9]{10}$/,
                    message: "ใบประกอบวิชาชีพต้องมีความยาว 10 หลัก (ตัวอักษรหรือตัวเลข)!",
                  },
                ]}
              >
                <Input placeholder="กรุณากรอกใบประกอบวิชาชีพ" maxLength={10} />
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




            <Col span={6}>
              <Form.Item
                label="ตำแหน่ง"
                name="PositionID"
                rules={[{ required: true, message: "กรุณาเลือกตำแหน่ง!" }]}
              >
                <Select
                  placeholder="เลือกตำแหน่ง"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {positions.map((position) => (
                    <Option key={position.ID} value={position.ID}>
                      {position.position_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>


            <Col span={6}>
              <Form.Item
                label="แผนก"
                name="DepartmentID"
                rules={[{ required: true, message: "กรุณาเลือกแผนก!" }]}
              >
                <Select
                  placeholder="เลือกแผนก"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {departments.map((department) => (
                    <Option key={department.ID} value={department.ID}>
                      {department.department_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>




            <Col span={6}>
              <Form.Item
                label="ผู้เชี่ยวชาญ"
                name="SpecialistID"
                rules={[{ required: true, message: "กรุณากรอกผู้เชี่ยวชาญ!" }]}
              >
                <Select placeholder="เลือกผู้เชี่ยวชาญ">
                  {specialists.map((specialist) => (
                    <Option key={specialist.ID} value={specialist.ID}>
                      {specialist.specialist_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="สถานะ"
                name="StatusID"
                rules={[{ required: true, message: "กรุณากรอกสถานะ!" }]}
              >
                <Select placeholder="เลือกสถานะ">
                  {statuses.map((status) => (
                    <Option key={status.ID} value={status.ID}>
                      {status.status_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="ที่อยู่"
                name="Address"
                rules={[{ required: true, message: "กรุณากรอกที่อยู่!" }]}
              >
                <Input.TextArea rows={4} placeholder="กรอกที่อยู่ของคุณ" />
              </Form.Item>
            </Col>



          </Row>

          
        </Form>
      </Modal>
  
      {/* Image Preview Modal */}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
  
};

export default ReadCSV;
