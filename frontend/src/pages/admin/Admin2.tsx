// import React, { useState } from "react";
// import {
//   Table,
//   Input,
//   Upload,
//   Typography,
//   Row,
//   Col,
//   Button,
//   Form,
//   message,
// } from "antd";
// import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
// import Papa from "papaparse";
// import EditRowModal from "../../components/Table/EditRowModal"; // Import the modal component

// const { Text } = Typography;

// const Admin2: React.FC = () => {
//   const [form] = Form.useForm();
//   const [columns, setColumns] = useState<any[]>([]);
//   const [rows, setRows] = useState<any[]>([]);
//   const [filteredRows, setFilteredRows] = useState<any[]>([]);
//   const [formData, setFormData] = useState<any>({});
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [fileList, setFileList] = useState<any[]>([]); // For EditRowModal

//   // Dropdown options for EditRowModal
//   const [genders] = useState([
//     { ID: 1, gender_name: "Male" },
//     { ID: 2, gender_name: "Female" },
//   ]);
//   const [positions] = useState([
//     { ID: 1, position_name: "Manager" },
//     { ID: 2, position_name: "Staff" },
//   ]);
//   const [departments] = useState([
//     { ID: 1, department_name: "HR" },
//     { ID: 2, department_name: "IT" },
//   ]);
//   const [statuses] = useState([
//     { ID: 1, status_name: "Active" },
//     { ID: 2, status_name: "Inactive" },
//   ]);
//   const [specialists] = useState([
//     { ID: 1, specialist_name: "Engineer" },
//     { ID: 2, specialist_name: "Designer" },
//   ]);
//   const [bloodGroups] = useState([
//     { ID: 1, blood_group: "A" },
//     { ID: 2, blood_group: "B" },
//     { ID: 3, blood_group: "O" },
//     { ID: 4, blood_group: "AB" },
//   ]);
//   const [diseases] = useState([
//     { ID: 1, disease_name: "Diabetes" },
//     { ID: 2, disease_name: "Hypertension" },
//   ]);

//   // Handle CSV Upload and Parsing
//   const normalizeKey = (key: string) => key.trim().toLowerCase();

//   const handleFileUpload = (file: File) => {
//     if (file.type !== "text/csv") {
//       message.error("Please upload a valid CSV file.");
//       return false;
//     }
//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (result) => {
//         if (result.errors.length === 0) {
//           const data = result.data as any[];
//           if (data.length > 0) {
//             const normalizedData = data.map((row) =>
//               Object.keys(row).reduce((acc, key) => {
//                 acc[normalizeKey(key)] = row[key];
//                 return acc;
//               }, {} as any)
//             );

//             const cleanData = normalizedData.map((row, index) => ({
//               ...row,
//               id: index, // Add unique ID for row key
//               status: row.firstname && row.lastname ? "Ready" : "Not Ready",
//             }));

//             setColumns([
//               { title: "First Name", dataIndex: "firstname", key: "firstname" },
//               { title: "Last Name", dataIndex: "lastname", key: "lastname" },
//               { title: "Status", dataIndex: "status", key: "status" },
//             ]);
//             setRows(cleanData);
//             setFilteredRows(cleanData);
//           } else {
//             message.warning("No data found in the uploaded file.");
//           }
//         } else {
//           message.error("Error parsing CSV file.");
//         }
//       },
//     });
//     return false;
//   };

//   // Show modal for row editing
//   const showModal = (row: any) => {
//     setFormData(row);
//     form.setFieldsValue(row);
//     setIsModalVisible(true);
//   };

//   // Handle modal save
//   const handleModalOk = (updatedRow: any) => {
//     const updatedRows = rows.map((row) =>
//       row.id === updatedRow.id ? { ...row, ...updatedRow } : row
//     );
//     setRows(updatedRows);
//     setFilteredRows(
//       updatedRows.filter((row) =>
//         row.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         row.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     setIsModalVisible(false);
//   };

//   const handleModalCancel = () => {
//     setIsModalVisible(false);
//   };

//   // Handle search
//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     setFilteredRows(
//       rows.filter(
//         (row) =>
//           row.firstname?.toLowerCase().includes(term.toLowerCase()) ||
//           row.lastname?.toLowerCase().includes(term.toLowerCase())
//       )
//     );
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1 style={{ textAlign: "center", color: "#1890ff" }}>Upload and Manage Data</h1>

//       {/* Search Bar */}
//       <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
//         <Col span={12}>
//           <Input
//             placeholder="Search by Name"
//             prefix={<SearchOutlined />}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//         </Col>
//         <Col span={12}>
//           <Upload beforeUpload={handleFileUpload} accept=".csv" showUploadList={false}>
//             <Button type="primary" icon={<UploadOutlined />}>
//               Upload CSV
//             </Button>
//           </Upload>
//         </Col>
//       </Row>

//       {/* Data Table */}
//       <Table
//         dataSource={filteredRows}
//         columns={columns}
//         rowKey={(record) => record.id} // Use unique ID
//         pagination={{ pageSize: 5 }}
//         onRow={(record) => ({
//           onClick: () => showModal(record),
//         })}
//         bordered
//         style={{
//           boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//           borderRadius: "8px",
//         }}
//       />

//       {/* Modal for Editing Row */}
//       <EditRowModal
//         visible={isModalVisible}
//         form={form}
//         fileList={fileList}
//         onCancel={handleModalCancel}
//         onFinish={handleModalOk}
//         genders={genders}
//         positions={positions}
//         departments={departments}
//         statuses={statuses}
//         specialists={specialists}
//         bloodGroups={bloodGroups}
//         diseases={diseases}
//         onFileChange={({ fileList: newFileList }) => setFileList(newFileList)}
//         onPreview={(file) => {
//           // Preview logic can be implemented here
//           console.log(file);
//         }}
//         isSubmitting={false}
//       />
//     </div>
//   );
// };

// export default Admin2;
