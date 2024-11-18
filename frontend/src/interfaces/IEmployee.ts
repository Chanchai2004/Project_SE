export interface IEmployee {
  ID?: number;
  FirstName?: string;
  LastName?: string;
  DateOfBirth?: string;
  Email?: string;
  Phone?: string;
  Address?: string;
  GenderID?: number;
  PositionID?: number;
  DepartmentID?: number;
  StatusID?: number;
  SpecialistID?: number;
  Password?: string;
  Username?: string; // เพิ่มฟิลด์ Username
  ProfessionalLicense?: string; // เพิ่มฟิลด์ Professional License
  CongenitalDisease?: string; // เพิ่มฟิลด์ Congenital Disease
  Graduate?: string; // เพิ่มฟิลด์ Graduate
  Profile?: string; // เพิ่มฟิลด์ Profile
  BloodGroupID?: number; // เพิ่มฟิลด์ Blood Group
  InfoConfirm?: boolean; // เพิ่มฟิลด์ Info Confirm
  NationalID?: string; // เพิ่มฟิลด์ National ID
  Diseases?: number[]; // เพิ่มฟิลด์ Diseases (รับ ID ของโรคที่เกี่ยวข้อง)
}
