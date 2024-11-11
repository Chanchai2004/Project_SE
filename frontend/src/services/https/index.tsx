import { IEmployee } from "../../interfaces/IEmployee";

const apiUrl = "http://localhost:8000";

// ฟังก์ชันสำหรับดึง token จาก localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ฟังก์ชันสำหรับสร้าง Employee
async function createEmployee(employee: IEmployee) {
  const requestOptions = {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(employee),
  };

  let res = await fetch(`${apiUrl}/employees`, requestOptions)
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Error creating employee:", error);
      return false;
    });

  return res;
}

async function getEmployeeById(id: string): Promise<IEmployee | false> {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  const response = await fetch(`${apiUrl}/employee/${id}`, requestOptions);
  if (response.status === 200) {
    const data: IEmployee = await response.json();
    return data;
  } else {
    console.error(`Failed to fetch employee with ID: ${id}`);
    return false;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล Employee ทั้งหมด
async function listEmployees() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/employees`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Error listing employees:", error);
      return false;
    });

  return res;
}

// ฟังก์ชันสำหรับดึงข้อมูล Genders ทั้งหมด
async function listGenders() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/genders`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Error listing genders:", error);
      return false;
    });

  return res;
}

// ฟังก์ชันสำหรับดึงข้อมูล Positions ทั้งหมด
async function listPositions() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/positions`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Error listing positions:", error);
      return false;
    });

  return res;
}

// ฟังก์ชันสำหรับดึงข้อมูล Departments ทั้งหมด
async function listDepartments() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/departments`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Error listing departments:", error);
      return false;
    });

  return res;
}

// ฟังก์ชันสำหรับดึงข้อมูล Statuses ทั้งหมด
async function listStatuses() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/statuses`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Error listing statuses:", error);
      return false;
    });

  return res;
}

// ฟังก์ชันสำหรับดึงข้อมูล Specialists ทั้งหมด
async function listSpecialists() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/specialists`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("Error listing specialists:", error);
      return false;
    });

  return res;
}

// ฟังก์ชันสำหรับการเข้าสู่ระบบและรับ token
async function authenticateUser(username: string, password: string) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };

  let res = await fetch(`${apiUrl}/auth/signin`, requestOptions)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.error("Authentication failed with status:", response.status);
        return false;
      }
    })
    .catch((error) => {
      console.error("Error authenticating user:", error);
      return false;
    });

  if (res) {
    // เก็บ token ลงใน localStorage เพื่อใช้ในอนาคต
    localStorage.setItem("authToken", res.token);
  }

  return res;
}

export {
  createEmployee,
  listEmployees,
  listGenders,
  listPositions,
  listDepartments,
  listStatuses,
  listSpecialists,
  authenticateUser,
  getEmployeeById,
};
