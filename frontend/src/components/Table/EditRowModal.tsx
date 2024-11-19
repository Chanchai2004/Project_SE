// import React, { useEffect } from "react";
// import {
//     Modal,
//     Form,
//     Input,
//     DatePicker,
//     Select,
//     Row,
//     Col,
//     Button,
//     Upload,
//     Space,
// } from "antd";
// import ImgCrop from "antd-img-crop";
// import { PlusOutlined } from "@ant-design/icons";

// const { Option } = Select;

// interface EditRowModalProps {
//     visible: boolean;
//     form: any;
//     fileList: any[];
//     genders: any[];
//     positions: any[];
//     departments: any[];
//     statuses: any[];
//     specialists: any[];
//     bloodGroups: any[];
//     initialValues: any;
//     onCancel: () => void;
//     onFinish: (values: any) => void;
//     onFileChange: (fileList: any) => void;
//     onPreview: (file: any) => void;
//     isSubmitting: boolean;
// }

// const EditRowModal: React.FC<EditRowModalProps> = ({
//     visible,
//     form,
//     fileList,
//     genders,
//     positions,
//     departments,
//     statuses,
//     specialists,
//     bloodGroups,
//     initialValues,
//     onCancel,
//     onFinish,
//     onFileChange,
//     onPreview,
//     isSubmitting,
// }) => {
//     useEffect(() => {
//         if (visible && initialValues) {
//             form.setFieldsValue(initialValues);
//         }
//     }, [visible, initialValues, form]);

//     return (
//         <Modal
//             title="Edit Row Details"
//             visible={visible}
//             onOk={form.submit}
//             onCancel={onCancel}
//             okText="Save"
//             width="80%"
//         >
//             <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
//                 <Row gutter={[16, 16]}>
//                     <Col span={24}>
//                         <Form.Item label="รูปประจำตัว" name="Profile">
//                             <ImgCrop rotationSlider>
//                                 <Upload
//                                     fileList={fileList}
//                                     onChange={onFileChange}
//                                     maxCount={1}
//                                     listType="picture-card"
//                                     onPreview={onPreview}
//                                 >
//                                     {fileList.length < 1 && (
//                                         <div>
//                                             <PlusOutlined />
//                                             <div style={{ marginTop: 8 }}>อัพโหลด</div>
//                                         </div>
//                                     )}
//                                 </Upload>
//                             </ImgCrop>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//     <Form.Item
//         label="วันเกิด"
//         name="DateOfBirth"
//         rules={[{ required: true, message: "กรุณาเลือกวันเกิด!" }]}
//     >
//         <DatePicker format="YYYY-MM-DD" />
//     </Form.Item>
// </Col>

// <Col span={12}>
//     <Form.Item
//         label="โรคประจำตัว"
//         name="Diseases"
//     >
//         <Select mode="multiple">
//             {diseases.map((disease) => (
//                 <Option key={disease.ID} value={disease.ID}>
//                     {disease.disease_name}
//                 </Option>
//             ))}
//         </Select>
//     </Form.Item>
// </Col>


//                     <Col span={12}>
//                         <Form.Item
//                             label="ชื่อจริง"
//                             name="FirstName"
//                             rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
//                         >
//                             <Input />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="นามสกุล"
//                             name="LastName"
//                             rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
//                         >
//                             <Input />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="หมายเลขบัตรประชาชน"
//                             name="NationalID"
//                             rules={[{ required: true, message: "กรุณากรอกหมายเลขบัตรประชาชน!" }]}
//                         >
//                             <Input maxLength={13} />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="อีเมล"
//                             name="Email"
//                             rules={[{ required: true, type: "email", message: "กรุณากรอกอีเมลที่ถูกต้อง!" }]}
//                         >
//                             <Input />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="เบอร์โทรศัพท์"
//                             name="Phone"
//                             rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
//                         >
//                             <Input maxLength={10} />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="เพศ"
//                             name="GenderID"
//                             rules={[{ required: true, message: "กรุณาเลือกเพศ!" }]}
//                         >
//                             <Select>
//                                 {genders.map((gender) => (
//                                     <Option key={gender.ID} value={gender.ID}>
//                                         {gender.gender_name}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="กรุ๊ปเลือด"
//                             name="BloodGroupID"
//                             rules={[{ required: true, message: "กรุณาเลือกกรุ๊ปเลือด!" }]}
//                         >
//                             <Select>
//                                 {bloodGroups.map((bloodGroup) => (
//                                     <Option key={bloodGroup.ID} value={bloodGroup.ID}>
//                                         {bloodGroup.blood_group}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="ชื่อผู้ใช้งาน"
//                             name="Username"
//                             rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้งาน!" }]}
//                         >
//                             <Input />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="รหัสผ่าน"
//                             name="Password"
//                             rules={[{ required: true, min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร!" }]}
//                         >
//                             <Input.Password />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="ใบประกอบวิชาชีพ"
//                             name="ProfessionalLicense"
//                             rules={[{ required: true, message: "กรุณากรอกใบประกอบวิชาชีพ!" }]}
//                         >
//                             <Input maxLength={10} />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="ระดับการศึกษา"
//                             name="Graduate"
//                             rules={[{ required: true, message: "กรุณากรอกระดับการศึกษา!" }]}
//                         >
//                             <Input />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="ตำแหน่ง"
//                             name="PositionID"
//                             rules={[{ required: true, message: "กรุณาเลือกตำแหน่ง!" }]}
//                         >
//                             <Select>
//                                 {positions.map((position) => (
//                                     <Option key={position.ID} value={position.ID}>
//                                         {position.position_name}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="แผนก"
//                             name="DepartmentID"
//                             rules={[{ required: true, message: "กรุณาเลือกแผนก!" }]}
//                         >
//                             <Select>
//                                 {departments.map((department) => (
//                                     <Option key={department.ID} value={department.ID}>
//                                         {department.department_name}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="ผู้เชี่ยวชาญ"
//                             name="SpecialistID"
//                             rules={[{ required: true, message: "กรุณาเลือกผู้เชี่ยวชาญ!" }]}
//                         >
//                             <Select>
//                                 {specialists.map((specialist) => (
//                                     <Option key={specialist.ID} value={specialist.ID}>
//                                         {specialist.specialist_name}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             label="สถานะ"
//                             name="StatusID"
//                             rules={[{ required: true, message: "กรุณาเลือกสถานะ!" }]}
//                         >
//                             <Select>
//                                 {statuses.map((status) => (
//                                     <Option key={status.ID} value={status.ID}>
//                                         {status.status_name}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={24}>
//                         <Form.Item
//                             label="ที่อยู่"
//                             name="Address"
//                             rules={[{ required: true, message: "กรุณากรอกที่อยู่!" }]}
//                         >
//                             <Input.TextArea rows={4} />
//                         </Form.Item>
//                     </Col>
//                 </Row>

//                 <Row justify="center" style={{ marginTop: 16 }}>
//                     <Space>
//                         <Button htmlType="button" onClick={onCancel}>
//                             ยกเลิก
//                         </Button>
//                         <Button type="primary" htmlType="submit" loading={isSubmitting}>
//                             ยืนยัน
//                         </Button>
//                     </Space>
//                 </Row>
//             </Form>
//         </Modal>
//     );
// };

// export default EditRowModal;
