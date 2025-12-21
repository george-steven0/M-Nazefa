import type { GetProp, UploadFile, UploadProps } from "antd";
import type { ApexOptions } from "apexcharts";
import type { TFunction } from "i18next";

export type translationType = {
  t: TFunction;
};

export type APIErrorProps = {
  data: {
    errorMessage?: string[];
    errorMessages?: string[];
    validationErrors?: string[];
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
  DescendingOrder?: string;
  search?: string;
};

export type APIError = {
  status: number;
  data?: {
    message?: string;
    errorMessages?: string[];
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
  Roles?: string[];
  Role?: string[];
  WorkId?: string;
  StartingDate: string;
  IdNumber: string | number;
  PostalCode: string;
  Address: string;
  ImageFile: string | File;
  ImagePath: string | File;
  File: string | File;
  IsImageChanged: boolean;
};

export type deactivateEmployeeProps = {
  employeeId: string;
  isActive: boolean;
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
  roles: string[];
  imagePath: string | null;
};

export type singleEmployeeProps = {
  address: string;
  userName: string;
  dateOfBirth: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  id: string;
  idNumber: string;
  imagePath: string;
  ImageFile: string;
  phoneNumber: string;
  postalCode: string;
  roles: string[];
  startingDate: string;
  workId: string;
};

type addressProps = {
  cityId: string;
  AreaId: string;
  areaId?: string;
  street: string;
  apartment: string;
  floor: string | number;
  postalCode: string;
  landmark: string;
  landMark?: string;
  fullDescription: string;
};
export type clientFormPropsType = {
  id?: number | string;
  firstName: string;
  middleName: string;
  lastName: string;
  idNumber: string | number;
  phoneNumber: string | number;
  email: string;
  isActive?: boolean;
  CustomerTypeId?: string | number;
  customerTypeId?: string | number;
  customerAddresses: (addressProps & buildingProps)[];
  address?: (addressProps & buildingProps)[];
};
export type buildingProps = {
  space: string;
  BuildingTypeId: string;
  buildingTypeId?: string;
  state?: string;
  LandTypeId: string;
  landTypeId?: string;
  // insects: string | boolean;
  // rodents: string | boolean;
  // tools: string;
  // materialWeight: string;
  numberOfWindows: string;
  // numberOfWorkers: string;
  // brideCleansUp: string | boolean;
  // duration?: string[];
  // visitStart: string;
  // visitEnd: string;
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
  title?: string;
  description?: string;
  package?: string;
  extraId?: (string | number)[];
  extraDescription?: string;
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

export type changePasswordForm = {
  employeeId: string;
  newPassword: string;
};

export type rolesFormProps = {
  id?: string;
  name: string;
  description?: string;
};

export type seedersProps = {
  id?: string;
  name: string;
  arName: string;
};
