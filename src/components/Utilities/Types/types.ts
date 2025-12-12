import type { GetProp, UploadFile, UploadProps } from "antd";
import type { ApexOptions } from "apexcharts";
import type { TFunction } from "i18next";

export type translationType = {
  t: TFunction;
};

export type APIErrorProps = {
  data: {
    errorMessage: string;
    validationErrors: string[];
  };
};

export type APIResponse<T> = {
  data: T[];
  paginationHeader: {
    CurrentPage: number;
    totalPages: number;
    NumberOfItemsPerPage: number;
    totalItems: number;
  };
  isSuccess?: boolean;
  errorMessages?: string[];
};

export type SingleAPIResponse<T> = {
  data: T;
  isSuccess?: boolean;
  errorMessages?: string[];
};

export type APIParams = {
  page?: string | number;
  size?: string | number;
  id?: string | number;
};

export type APIError = {
  status: number;
  data?: {
    message?: string;
  };
};

export type ChartState = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options: ApexOptions;
};
export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export type loginProps = {
  email: string;
  password: string;
};
export type loginResponseProps = {
  token: string;
  email: string;
  fullName: string;
  rolesList: string[];
  userName: string;
};
export type employeeFormProps = {
  DateOfBirth: string;
  Email: string;
  Password: string;
  UserName: string;
  FirstName: string;
  Gender: string;
  LastName: string;
  PhoneNumber: string | number;
  Role: string[];
  WorkId?: string;
  StartingDate: string;
  IdNumber: string | number;
  PostalCode: string;
  Address: string;
  ImageFile: string | File;
};

export type rolesProps = {
  id: string;
  name: string;
  description: string;
};
export type employeeResponseProps = {
  id: string;
  fullName: string;
  userName: string;
  roles: rolesProps[];
  imagePath: string | null;
};

export type singleEmployeeProps = {
  address: string;
  userName: string;
  dateOfBirth: string;
  email: string;
  fullName: string;
  gender: string;
  id: string;
  idNumber: string;
  imagePath: string;
  phoneNumber: string;
  postalCode: string;
  roles: string[];
  startingDate: string;
  workId: string;
};

export type clientsPropsType = {
  key?: string | number;
  id: string | number;
  name: string;
  joinDate: string;
  phoneNumber: string | number;
  status: string;
};

type addressProps = {
  cityId: string;
  areaId: string;
  street: string;
  apartment: string;
  floor: string | number;
  postalCode: string;
  landmark: string;
  fullDescription: string;
};
export type clientFormPropsType = {
  firstName: string;
  middleName: string;
  lastName: string;
  idNumber: string | number;
  phoneNumber: string | number;
  email: string;
  customerAddresses: (addressProps & buildingProps)[];
};

export type packageFormProps = {
  title: string;
  description: string;
  image: string | File;
  subTitle: string;
  numberOfWorkers: string | number;
  workingHours: string;
  haveOn: string;
  notHav: string;
  tool: string;
  supplies: string;
  rules: string | number;
  terms: UploadFile | null;
};

export type appointmentProps = {
  date: string;
  startTime: string;
  endTime: string;
};

export type buildingProps = {
  space: string;
  buildType: string;
  states: string;
  landType: string;
  insects: string;
  rodents: string;
  tools: string;
  materialWeight: string;
  numberOfWindows: string;
  numberOfWorkers: string;
  brideClean: string;
  duration: string[];
};

export type extraServiceProps = {
  extraRoom: string;
  extraRoomDescription: string;
  comments: string;
};

export type reservationFormProps = {
  customerId: string | number;
} & clientFormPropsType &
  appointmentProps &
  buildingProps &
  extraServiceProps;

export type serviceFormProps = {
  id?: string | number;
  title: string;
  description: string;
  package: string;
  extraId: (string | number)[];
  extraDescription: string;
};

export type messagesProps = {
  title: string;
  message: string;
  customerId: string | number;
};

export type LoginProps = {
  email: string;
  password: string;
};
