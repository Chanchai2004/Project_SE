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
    };

    fetchData();
    fetchEmployeeData();
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
      <Table
        dataSource={rows.filter(
          (row) =>
            row.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        columns={columns}
        rowKey={(record) => record.firstname + record.lastname}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="Edit Row Details"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="First Name" name="firstname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReadCSV;
