export interface IEmployee {
  ID?: number;
  FirstName?: string;
  LastName?: string;
  Age?: number;
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
}
