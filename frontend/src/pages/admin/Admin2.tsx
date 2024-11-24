import React, { useState, useEffect } from "react";
import ImgCrop from "antd-img-crop";
import Papa from "papaparse";
import { Spin } from "antd";
import sendEmail from "../../components/SendEmail/email_register";
import { Table, Input, Modal, Upload, Typography, Form, DatePicker, Select, Row, Col, Button, Space, message, Card } from "antd";
import { UploadOutlined, SearchOutlined, PlusOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
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
import moment from "moment";
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

  const [isLoading, setIsLoading] = useState(false);

  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

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
  const [savedRows, setSavedRows] = useState<any[]>([]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);


  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });




  useEffect(() => {
    // Fetch data from API and localStorage when the component is mounted
    const fetchData = async () => {
      try {
        const [
          genderRes,
          positionRes,
          departmentRes,
          statusRes,
          specialistRes,
          bloodGroupRes,
          diseaseRes,
        ] = await Promise.all([
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

    // Call all functions when the component is mounted
    fetchData();
    fetchEmployeeData();
    loadUploadedRows();
  }, [form, savedRows]);


  const loadUploadedRows = () => {
    try {
      const storedRows = localStorage.getItem("uploadedRows");
      const storedSavedRows = localStorage.getItem("savedRows");

      let parsedSavedRows = [];
      if (storedSavedRows) {
        parsedSavedRows = JSON.parse(storedSavedRows); // Load savedRows from localStorage
      }

      if (storedRows) {
        const parsedRows = JSON.parse(storedRows);

        const mergedRows = parsedRows.map((row: any) => {
          const savedRow = parsedSavedRows.find(
            (saved: any) =>
              saved.firstname === row.firstname && saved.lastname === row.lastname
          );
          return savedRow ? { ...row, ...savedRow } : row; // Use savedRow if it exists
        });

        const updatedRows = mergedRows.map((row: any) => ({
          ...row,
          formStatus: checkFormCompletion(row) ? "สมบูรณ์" : "ไม่สมบูรณ์", // ตรวจสอบฟอร์ม
        }));

        setColumns([
          { title: "First Name", dataIndex: "firstname", key: "firstname" },
          { title: "Last Name", dataIndex: "lastname", key: "lastname" },
          { title: "Email", dataIndex: "email", key: "email" },
          { title: "Form Status", dataIndex: "formStatus", key: "formStatus" },
        ]);

        setRows(updatedRows);
        console.log("Rows loaded successfully:", updatedRows);
      } else {
        console.log("No uploaded rows found in localStorage.");
      }
    } catch (error) {
      console.error("Error loading uploaded rows from localStorage:", error);
    }
  };



  const checkFormCompletion = (row: any) => {
    const requiredFields = [
      "firstname",
      "lastname",
      "nationalid",
      "email",
      "phone",
      "genderid",
      "bloodgroup",
      "username",
      "password",
      "professionallicense",
      "graduate",
      "position",
      "department",
      "specialist",
      "status",
      "address",
      "dateofbirth", // เพิ่ม dateofbirth

    ];

    // ตรวจสอบว่าทุกฟิลด์ที่จำเป็นถูกกรอกครบ (ไม่ว่าง)
    return requiredFields.every((field) => {
      const value = row[field]; // ดึงค่าจาก row
      return value !== null && value !== undefined && value.toString().trim() !== "";
    });

  };







  const handleModalOk = () => {
    const formValues = form.getFieldsValue(true); // ดึงค่าทั้งหมดจากฟอร์ม
    console.log("Form Values on Save:", formValues);

    // แปลงคีย์จากฟอร์มให้ตรงกับโครงสร้างของ rows
    const normalizedFormValues = {
      firstname: formValues.FirstName,
      lastname: formValues.LastName,
      nationalid: formValues.NationalID,
      email: formValues.Email,
      phone: formValues.Phone,
      genderid: formValues.GenderID,
      bloodgroup: formValues.BloodGroupID,
      diseases: formValues.Diseases || [],
      username: formValues.Username,
      password: formValues.Password,
      professionallicense: formValues.ProfessionalLicense,
      graduate: formValues.Graduate,
      position: formValues.PositionID,
      department: formValues.DepartmentID,
      specialist: formValues.SpecialistID,
      status: formValues.StatusID,
      address: formValues.Address,
      profile: fileList[0]?.thumbUrl || "", // ดึงค่า Profile (ถ้ามี)
      dateofbirth: formValues.DateOfBirth
        ? formValues.DateOfBirth.format("YYYY-MM-DD HH:mm:ss") // แปลงวันเกิดเป็นรูปแบบที่ต้องการ
        : null, // หากไม่มีให้เป็น null
    };

    // อัปเดตแถวใน rows
    const updatedRows = rows.map((row) =>
      row.firstname === formData.firstname && row.lastname === formData.lastname
        ? { ...row, ...normalizedFormValues }
        : row
    );

    setRows(updatedRows); // อัปเดต rows

    // อัปเดต savedRows
    const updatedSavedRows = savedRows.filter(
      (row) =>
        row.firstname !== formData.firstname || row.lastname !== formData.lastname
    );
    updatedSavedRows.push(normalizedFormValues);
    setSavedRows(updatedSavedRows);

    // อัปเดต localStorage
    localStorage.setItem("uploadedRows", JSON.stringify(updatedRows));
    localStorage.setItem("savedRows", JSON.stringify(updatedSavedRows));

    console.log("Updated Rows:", updatedRows);
    console.log("Updated Saved Rows:", updatedSavedRows);

    setIsModalVisible(false); // ปิด Modal
  };




  const normalizeKey = (key: string) => key.trim().toLowerCase();

  const handleUploadChange = async ({ fileList: newFileList }) => {
    // หากอัปโหลดไฟล์ใหม่ ให้แปลงเป็น Base64
    if (newFileList.length > 0 && newFileList[0]?.originFileObj) {
      const base64 = await getBase64(newFileList[0].originFileObj);
      newFileList[0].thumbUrl = base64; // ใช้ Base64 แทน URL
    }
    setFileList(newFileList); // อัปเดต fileList
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


  const handleDrop = (e) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "text/csv") {
        handleFileUpload(file); // เรียกใช้ฟังก์ชันอัปโหลดไฟล์ CSV เดิมของคุณ
      } else {
        message.error("กรุณาอัปโหลดไฟล์ CSV เท่านั้น");
      }
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== "text/csv") {
      message.error("กรุณาอัปโหลดไฟล์ CSV ที่ถูกต้อง");
      return false;
    }

    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length === 0) {
          const data = result.data as any[];
          if (data.length > 0) {
            const normalizedData = data.map((row) =>
              Object.keys(row).reduce((acc, key) => {
                acc[normalizeKey(key)] = row[key]; // Normalize all keys to lowercase
                return acc;
              }, {} as any)
            );

            const cleanData = normalizedData.map((row) => {
              // ตรวจสอบ dateofbirth ว่าตรง format หรือไม่
              const isValidDate =
                typeof row.dateofbirth === "string" &&
                /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/.test(
                  row.dateofbirth
                );

              // ตรวจสอบ profile ว่าเป็น Base64 หรือไม่
              const isValidProfile =
                typeof row.profile === "string" &&
                /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(row.profile);

              return {
                ...row,
                dateofbirth: isValidDate ? row.dateofbirth : "", // หากไม่ตรง format ให้เป็นค่าว่าง
                profile: isValidProfile ? row.profile : "", // หากไม่ใช่ Base64 ให้เป็นค่าว่าง
                formStatus: "ข้อมูลใหม่", // ตรวจสอบฟอร์ม
              };
            });

            // ตรวจสอบข้อมูลซ้ำ
            const uniqueData = cleanData.filter((newRow) => {
              return !rows.some(
                (existingRow) =>
                  existingRow.firstname === newRow.firstname &&
                  existingRow.lastname === newRow.lastname &&
                  existingRow.email === newRow.email
              );
            });

            // อัปเดตแถวในตาราง
            const mergedRows = [...rows, ...uniqueData];

            setColumns([
              { title: "First Name", dataIndex: "firstname", key: "firstname" },
              { title: "Last Name", dataIndex: "lastname", key: "lastname" },
              { title: "Email", dataIndex: "email", key: "email" },
              { title: "Form Status", dataIndex: "formStatus", key: "formStatus" },
            ]);

            setRows(mergedRows);

            // Save to localStorage (รวมข้อมูลใหม่กับข้อมูลเก่า)
            const existingRows = JSON.parse(
              localStorage.getItem("uploadedRows") || "[]"
            );
            const combinedRows = [...existingRows, ...uniqueData];
            localStorage.setItem("uploadedRows", JSON.stringify(combinedRows));

            setTimeout(() => {
              setIsLoading(false); // ปิด loading
            }, 500);
          } else {
            message.warning("ไม่พบข้อมูลในไฟล์");
          }
        } else {
          message.error("เกิดข้อผิดพลาดในการแปลงข้อมูล CSV.");
        }
      },
    });

    return false;
  };



  const handleDeleteRow = (record, e) => {
    e.stopPropagation(); // ป้องกัน Event ไปถึง onRow
    setSelectedRecord(record); // เก็บข้อมูลแถวที่ต้องการลบ
    setIsDeleteModalVisible(true); // เปิด Modal ยืนยันการลบ
  };

  const confirmDelete = () => {
    // ลบแถวออกจาก rows
    const updatedRows = rows.filter(
      (row) =>
        row.firstname !== selectedRecord.firstname ||
        row.lastname !== selectedRecord.lastname
    );
    setRows(updatedRows);

    // ลบจาก savedRows และบันทึกใหม่ใน LocalStorage
    const updatedSavedRows = savedRows.filter(
      (row) =>
        row.firstname !== selectedRecord.firstname ||
        row.lastname !== selectedRecord.lastname
    );
    setSavedRows(updatedSavedRows);
    localStorage.setItem("uploadedRows", JSON.stringify(updatedRows));
    localStorage.setItem("savedRows", JSON.stringify(updatedSavedRows));

    message.success("ลบข้อมูลเรียบร้อยแล้ว!");
    setIsDeleteModalVisible(false); // ปิด Modal
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false); // ปิด Modal โดยไม่ลบ
  };





  const showModal = (row: any) => {


    const mappedRow = {
      FirstName: row.firstname,
      LastName: row.lastname,
      NationalID: row.nationalid,
      Email: row.email,
      Phone: row.phone,
      GenderID: row.genderid,
      BloodGroupID: row.bloodgroup,
      Diseases: Array.isArray(row.diseases) ? row.diseases : [],
      Username: row.username,
      Password: row.password,
      ProfessionalLicense: row.professionallicense,
      Graduate: row.graduate,
      PositionID: row.position,
      DepartmentID: row.department,
      SpecialistID: row.specialist,
      StatusID: row.status,
      Address: row.address,
      DateOfBirth: row.dateofbirth ? moment(row.dateofbirth, "YYYY-MM-DD HH:mm:ss") : undefined, // แปลงเป็น moment
      Profile: row.profile, // เติมเฉพาะค่า valid
    };

    form.setFieldsValue(mappedRow);
    setFormData(row);

    if (row.profile === "") {
      setFileList([]);
    }
    setIsModalVisible(true);
  };






  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      // แปลงค่าที่เป็น string ให้เป็น ID
      const genderId = genders.find((gender) => gender.gender_name === values.GenderID)?.ID;
      const positionId = positions.find((position) => position.position_name === values.PositionID)?.ID;
      const departmentId = departments.find((department) => department.department_name === values.DepartmentID)?.ID;
      const statusId = statuses.find((status) => status.status_name === values.StatusID)?.ID;
      const specialistId = specialists.find((specialist) => specialist.specialist_name === values.SpecialistID)?.ID;
      const bloodGroupId = bloodGroups.find((bloodGroup) => bloodGroup.blood_group === values.BloodGroupID)?.ID;

      // ตรวจสอบเงื่อนไข หากค่าเป็น null ให้แจ้งเตือน
      if (!genderId) {
        alert("ไม่พบข้อมูลเพศที่ท่านกรอก กรุณาตรวจสอบอีกครั้ง!");
        setIsSubmitting(false);
        return;
      }
      if (!positionId) {
        alert("ไม่พบข้อมูลตำแหน่งที่ท่านกรอก กรุณาตรวจสอบอีกครั้ง!");
        setIsSubmitting(false);
        return;
      }
      if (!departmentId) {
        alert("ไม่พบข้อมูลแผนกที่ท่านกรอก กรุณาตรวจสอบอีกครั้ง!");
        setIsSubmitting(false);
        return;
      }
      if (!statusId) {
        alert("ไม่พบข้อมูลสถานะที่ท่านกรอก กรุณาตรวจสอบอีกครั้ง!");
        setIsSubmitting(false);
        return;
      }
      if (!bloodGroupId) {
        alert("ไม่พบข้อมูลกรุ๊ปเลือดที่ท่านกรอก กรุณาตรวจสอบอีกครั้ง!");
        setIsSubmitting(false);
        return;
      }

      const formattedValues = {
        first_name: values.FirstName,
        last_name: values.LastName,
        date_of_birth: values.DateOfBirth
          ? values.DateOfBirth.format("YYYY-MM-DDTHH:mm:ssZ") // ใช้รูปแบบ ISO 8601
          : null, // ใช้ null หากไม่มีค่า
        email: values.Email,
        phone: values.Phone,
        address: values.Address,
        username: values.Username,
        professional_license: values.ProfessionalLicense,
        graduate: values.Graduate,
        password: values.Password,
        gender_id: genderId, // ใช้ ID ที่ตรวจสอบแล้ว
        position_id: positionId,
        department_id: departmentId,
        status_id: statusId,
        specialist_id: specialistId || null, // อนุญาตให้ specialist_id เป็น null
        profile: fileList[0]?.thumbUrl || "", // ใช้ Base64 หรือค่าว่างหากไม่มีรูป
        blood_group_id: bloodGroupId,
        diseases: values.Diseases || [], // กรณีไม่มีค่า ให้เป็น array ว่าง
        national_id: values.NationalID, // เพิ่มฟิลด์ national_id หากไม่ได้ระบุไว้
        info_confirm: true, // เพิ่ม info_confirm กรณีต้องการค่า default เป็น true
      };

      // ตรวจสอบค่าที่จะส่งไป
      console.log("Formatted Values:", formattedValues);

      const result = await createEmployee(formattedValues);

      if (result.status === 201) {
        // ลบแถวที่ตรงกับ `firstname` และ `lastname` ที่ส่งไป
        const updatedRows = rows.filter(
          (row) =>
            row.firstname !== values.FirstName ||
            row.lastname !== values.LastName
        );
        setRows(updatedRows);

        // ลบแถวใน savedRows และอัปเดต localStorage
        const updatedSavedRows = savedRows.filter(
          (row) =>
            row.firstname !== values.FirstName ||
            row.lastname !== values.LastName
        );
        setSavedRows(updatedSavedRows);
        localStorage.setItem("uploadedRows", JSON.stringify(updatedRows));
        localStorage.setItem("savedRows", JSON.stringify(updatedSavedRows));

        message.success("บันทึกข้อมูลสำเร็จ!");
      } else {
        message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };




  return (
    <div style={{ padding: "0px" }}>
      {contextHolder}
      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <>
          <h1 style={{ textAlign: "center", color: "#1890ff" }}>Upload and Manage Data</h1>

          {/* Search and Upload Section */}
          <Card
            style={{

              marginBottom: "20px",
              padding: "0px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // เพิ่มเงา
              borderRadius: "50px", // เพิ่มความโค้งมน
              border: "1px solid #f0f0f0", // เพิ่มเส้นขอบให้ดูเนียน
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col span={18}>
                <Input
                  placeholder="ค้นหาชื่อ"
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "inset 0px 1px 3px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้ Input
                  }}
                />
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex", // ใช้ Flexbox
                  justifyContent: "center", // จัดให้อยู่ตรงกลางแนวนอน
                  alignItems: "center", // จัดให้อยู่ตรงกลางแนวตั้ง
                }}
              >
                <Upload beforeUpload={handleFileUpload} accept=".csv" showUploadList={false}>
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้ปุ่ม
                    }}
                  >
                    อัปโหลดไฟล์ CSV
                  </Button>
                </Upload>
              </Col>

              <Col
                span={2}
                style={{
                  display: "flex", // ใช้ Flexbox
                  justifyContent: "center", // จัดให้อยู่ตรงกลางแนวนอน
                  alignItems: "center", // จัดให้อยู่ตรงกลางแนวตั้ง
                }}
              >
                <Button
                  type="default"
                  icon={<ReloadOutlined />} // ไอคอนลูกศรหมุนวน
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้ปุ่ม
                  }}
                  onClick={() => setIsResetModalVisible(true)} // แสดง Modal ยืนยันการรีเซ็ต
                >
                  รีเซ็ต
                </Button>

                {/* Modal ยืนยันการรีเซ็ต */}
                <Modal
                  title="ยืนยันการรีเซ็ต"
                  visible={isResetModalVisible} // ควบคุมการแสดง Modal
                  onOk={() => {
                    // เมื่อผู้ใช้กดยืนยัน
                    setRows([]); // ล้างข้อมูลในตาราง
                    setSavedRows([]); // ล้างข้อมูลที่บันทึกไว้
                    localStorage.removeItem("uploadedRows"); // ลบข้อมูลใน localStorage
                    localStorage.removeItem("savedRows"); // ลบข้อมูลใน localStorage
                    setIsResetModalVisible(false); // ปิด Modal
                    message.success("ข้อมูลถูกรีเซ็ตเรียบร้อยแล้ว!"); // แจ้งเตือนเมื่อรีเซ็ตสำเร็จ
                  }}
                  onCancel={() => setIsResetModalVisible(false)} // ปิด Modal เมื่อกดยกเลิก
                  okText="ยืนยัน"
                  cancelText="ยกเลิก"
                >
                  <p>คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ต? ข้อมูลทั้งหมดในตารางจะถูกลบ</p>
                </Modal>
              </Col>


            </Row>
          </Card>


          {/* Data Table */}
          <Table
            dataSource={rows.filter(
              (row) =>
                row.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) || // ค้นหาโดย First Name
                row.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) || // ค้นหาโดย Last Name
                row.email?.toLowerCase().includes(searchTerm.toLowerCase()) // ค้นหาโดย Email
            )}
            columns={[
              {
                title: "ชื่อ",
                dataIndex: "firstname",
                key: "firstname",
                width: "25%",
                align: "center",
                render: (text) => <Text>{text || "-"}</Text>, // แสดง "-" ถ้าไม่มีข้อมูล
              },
              {
                title: "นาสกุล",
                dataIndex: "lastname",
                key: "lastname",
                width: "25%",
                align: "center",
                render: (text) => <Text>{text || "-"}</Text>, // แสดง "-" ถ้าไม่มีข้อมูล
              },
              {
                title: "อีเมล",
                dataIndex: "email",
                key: "email",
                width: "30%",
                align: "center",
                render: (text) => <Text>{text || "-"}</Text>, // แสดง "-" ถ้าไม่มีข้อมูล
              },
              {
                title: "สถานะของฟอร์ม", // เพิ่ม Status Column
                dataIndex: "formStatus",
                key: "formStatus",
                width: "10%",
                align: "center",
                render: (text) => {
                  let color = "red"; // ค่าเริ่มต้นสีแดงสำหรับ "ไม่สมบูรณ์"
                  if (text === "สมบูรณ์") {
                    color = "green"; // สีเขียวสำหรับ "สมบูรณ์"
                  } else if (text === "ข้อมูลใหม่") {
                    color = "#ffa940"; // สีเหลืองสำหรับ "ข้อมูลใหม่"
                  }

                  return (
                    <Text style={{ color }}>
                      {text || "ไม่สมบูรณ์"}
                    </Text>
                  );
                },
                // ใช้สีเขียวสำหรับ Ready และสีแดงสำหรับ Not Ready
              },
              {
                title: "จัดการ",
                key: "action",
                align: "center",
                width: "10%",
                render: (_, record) => (
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px", // ระยะห่างระหว่างไอคอนกับเส้นวงกลม
                        borderRadius: "50%", // สร้างเป็นวงกลม
                        border: "2px solid red", // เส้นขอบสีแดง
                      }}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined style={{ fontSize: "20px", color: "red" }} />}
                        onClick={(e) => handleDeleteRow(record, e)}
                        style={{
                          backgroundColor: "transparent", // พื้นหลังโปร่งใส
                          border: "none", // ไม่มีเส้นขอบของปุ่ม
                        }}
                      />
                    </div>
                  </div>
                ),
              },



            ]}
            rowKey={(record) => record.firstname + record.lastname} // ใช้ First Name + Last Name เป็น Key

            onRow={(record) => ({
              onClick: () => {
                console.log("Row clicked:", record); // Debug: Log clicked row
                showModal(record); // เปิด Modal พร้อมข้อมูลของแถว
              },
              onMouseEnter: (e) => {
                // เพิ่ม Tooltip เมื่อเลื่อนเมาส์
                const tooltipDiv = document.createElement("div");
                tooltipDiv.id = "custom-tooltip";
                tooltipDiv.innerHTML = `
                  <span style="
                    padding: 5px 10px; 
                    background-color: #f0f0f0; 
                    color: #333; 
                    border: 1px solid #d9d9d9; 
                    border-radius: 4px; 
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                    font-size: 12px;">
                    กดคลิกเพื่อแก้ไขข้อมูล
                  </span>`;
                tooltipDiv.style.position = "absolute";
                tooltipDiv.style.top = `${e.clientY + 10}px`;
                tooltipDiv.style.left = `${e.clientX + 10}px`;
                tooltipDiv.style.zIndex = 1000;
                document.body.appendChild(tooltipDiv);
              },
              onMouseLeave: () => {
                // ลบ Tooltip เมื่อเมาส์ออก
                const existingTooltip = document.getElementById("custom-tooltip");
                if (existingTooltip) {
                  document.body.removeChild(existingTooltip);
                }
              },
            })}


            bordered
            pagination={{
              position: ["bottomCenter"], // ตำแหน่ง Pagination ที่กึ่งกลางด้านล่าง
            }}
            style={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              marginTop: "20px", // เพิ่มระยะห่างจากส่วนบน
              minHeight: "70vh", // กำหนดความสูงขั้นต่ำให้ตารางเต็มหน้าจอ
              display: "flex",
              flexDirection: "column",
            }}
            locale={{
              emptyText: (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "65vh",
                  }}
                  onDrop={handleDrop} // ฟังก์ชันสำหรับจัดการการลากไฟล์
                  onDragOver={(e) => e.preventDefault()} // ป้องกันการเปิดไฟล์ในเบราว์เซอร์
                >
                  <div
                    style={{
                      fontSize: "40px",
                      color: "#1890ff",
                      marginBottom: "10px",
                    }}
                  >
                    <UploadOutlined />
                  </div>
                  <span style={{ fontSize: "16px", color: "#888" }}>
                    ลากและวางไฟล์ CSV ของคุณที่นี่
                  </span>
                </div>
              ),
            }}


          />
          {/* Modal ยืนยันการลบ */}
          <Modal
            title="ยืนยันการลบ"
            visible={isDeleteModalVisible}
            onOk={confirmDelete} // ยืนยันการลบ
            onCancel={cancelDelete} // ยกเลิกการลบ
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          >
            <p>
              คุณแน่ใจหรือไม่ว่าต้องการลบ{" "}
              <strong>
                {selectedRecord?.firstname} {selectedRecord?.lastname}
              </strong>
              ?
            </p>
          </Modal>




          {/* Edit Modal */}
          <Modal
            title="Edit Row Details"
            visible={isModalVisible}
            footer={null} // ลบ footer เดิมออก (ไม่มีปุ่ม OK และ Cancel)
            width="90%" // กำหนดความกว้างเป็น 90% ของหน้าจอ
            onCancel={() => {
              handleModalOk(); // เรียก handleModalOk เมื่อกดปุ่มกากบาท
              handleModalCancel(); // ปิด Modal
            }} // กากบาทยังคงทำงานเหมือนเดิม
          >
            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="รูปประจำตัว" name="Profile">
                    <ImgCrop rotationSlider>
                      <Upload
                        fileList={fileList}
                        onChange={handleUploadChange}
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

                <Form.Item
                  label="วันเกิด"
                  name="DateOfBirth"
                  rules={[{ required: true, message: "กรุณาเลือกวันเกิด!" }]}
                >
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>





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
                        <Option key={disease.disease_name} value={disease.ID}>
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
              {/* ปุ่มที่ท้ายฟอร์ม */}
              <Row justify="center" style={{ marginTop: 16 }}>
                <Space>
                  {/* ปุ่มยกเลิก */}
                  <Button
                    htmlType="button"
                    style={{ backgroundColor: "#e0dede" }}
                    onClick={() => {
                      handleModalCancel(); // เรียกฟังก์ชันปิด Modal
                      handleModalOk(); // เรียกฟังก์ชันอื่น ๆ
                    }}
                  >
                    ยกเลิก
                  </Button>


                  {/* ปุ่มยืนยัน */}
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
        </>
      )}
    </div>
  );

};

export default ReadCSV;
