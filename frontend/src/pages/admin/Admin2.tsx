import React, { useEffect, useState } from "react";
import { Descriptions, Spin } from "antd";
import { getEmployeeById } from "../../services/https";
import { IEmployee } from "../../interfaces/IEmployee";
import demoImage from "../../assets/demo.png";


const EmployeeDetails: React.FC = () => {
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      const id = localStorage.getItem("id");
      if (id) {
        try {
          const data = await getEmployeeById(Number(id));
          console.log("Fetched Employee Data:", data);
          setEmployee(data);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEmployee();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const profileImage = employee?.profile
  ? employee.profile.startsWith("data:image")
    ? employee.profile
    : `data:image/png;base64,${employee.profile}`
  : demoImage; // ใช้รูป demo.png หากไม่มีรูป
  

  return (
    <div style={{ padding: "20px" }}>
      {employee ? (
        <>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={profileImage}
              alt="Profile222"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
              }}
            />
          </div>
          <Descriptions title="Employee Information" bordered column={2}>
            <Descriptions.Item label="First Name">
              {employee?.first_name || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {employee?.last_name || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Age">{employee?.age || "Not Available"}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {employee?.date_of_birth || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {employee?.email || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {employee?.phone || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {employee?.address || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {employee?.Gender?.gender_name || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Position">
              {employee?.Position?.position_name || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {employee?.Department?.department_name || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {employee?.Status?.status_name || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Specialist">
              {employee?.Specialist?.specialist_name || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Professional License">
              {employee?.professional_license || "Not Available"}
            </Descriptions.Item>
            <Descriptions.Item label="Diseases">
              {employee?.diseases?.length > 0
                ? employee.diseases.map((disease) => disease.disease_name).join(", ")
                : "None"}
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        <p>No employee data found.</p>
      )}
    </div>
  );
};

export default EmployeeDetails;
