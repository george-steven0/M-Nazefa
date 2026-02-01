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
    isSuccess?: boolean;
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

export type GlobalSort = {
  field: string;
  order: "asc" | "desc";
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
  PostalCode?: string;
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
  postalCode?: string;
  roles: string[];
  startingDate: string;
  workId: string;
};

type addressProps = {
  id?: string | number;
  cityId: string;
  AreaId: string;
  areaId?: string;
  street: string;
  apartment: string;
  floor: string | number;
  postalCode?: string;
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
  phoneNumber?: string | number;
  phoneNumbers: { id?: string | number; phoneNumber: string | number }[];
  email: string;
  generalNotes: string;
  isActive?: boolean;
  CustomeTypeId?: string | number;
  CustomerTypeId?: string | number;
  customerTypeId?: string | number;
  hasMembership?: boolean;
  isOld: boolean;
  whatsAppNumber?: string | number;
  membershipId?: string | number;
  entryDate: string;
  customerAddresses: (addressProps & buildingProps)[];
  address?: (addressProps & buildingProps)[];
  favoriteList?:
    | {
        value: string;
      }[]
    | string[];
  NotRecommendedWorkerList?:
    | {
        value: string;
      }[]
    | string[];
  notRecommendedWorkerList?:
    | {
        value: string;
      }[]
    | string[];
};

export type buildingProps = {
  space: string;
  BuildingTypeId: string;
  buildingTypeId?: string;
  addressTypeId: string;
  state?: string;
  LandTypeId: string;
  landTypeId?: string;
  numberOfFloors?: string | number;
  noOfFloors?: string | number;
  numberOfWindows: string | number;
  numberOfKitchens: string | number;
  numberOfBedrooms: string | number;
  numberOfBathrooms: string | number;
  numberOfLivingRooms: string | number;
  numberOfReceptionrooms: string | number;
  hasPets: boolean;
  landLine: string;
  description?: string;
  // insects: string | boolean;
  // rodents: string | boolean;
  // tools: string;
  // materialWeight: string;
  // numberOfWorkers: string;
  // brideCleansUp: string | boolean;
  // duration?: string[];
  // visitStart: string;
  // visitEnd: string;
};

export type packageFormProps = {
  Title: string;
  ArTitle: string;
  SubTitle: string;
  ArSubTitle: string;
  Description: string;
  WhatYouWillHaveOnIt: string;
  WhatYouwouldntHaveOnIt: string;
  Tools: string;
  Supplies: string;
  Rules: string | number;
  TermsAndConditions: UploadFile | null;
  Logo: string | File;
  workingHours: string;
  PackageDetails: {
    NumberofRooms: string;
    NumberofWorkers: string;
    Price: string;
  }[];
  TransportationFees: { Fee: string; CityId: string }[];
};

// this type for card only
export type packageCard = {
  id: string | number;
  title: string;
  arTitle: string;
  subTitle: string;
  arSubTitle: string;
  description: string;
  whatYouWillHaveOnIt: string;
  whatYouWouldntHaveOnIt: string;
  whatYouwouldntHaveOnIt?: string;
  tools: string;
  supplies: string;
  rules: string | number;
  termsAndConditions:
    | UploadFile
    | null
    | {
        uid: string;
        name: string;
        status: string;
        url: string;
        percent: number;
      };
  logo: string;
  isActive: boolean;
  workingHours: string;
  packageDetails: {
    id?: string | number;
    numberofRooms: string;
    numberOfRooms?: string;
    numberofWorkers: string;
    numberOfWorkers?: string;
    price: string;
  }[];
  transportationFees: { id?: string; fee: string; cityId: string }[];
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
  addressId: string | number;
  duration: string[];
} & clientFormPropsType &
  appointmentProps &
  buildingProps &
  extraServiceProps;

export type serviceFormProps = {
  id?: string | number;
  title?: string;
  arTitle?: string;
  description?: string;
  package?: string;
  extraServices?:
    | {
        extraServiceId: string | number;
      }[]
    | null;
  packages?: {
    packageId: string | number;
  }[];
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
export type areaFormProps = {
  id?: string;
  cityId: string;
  name: string;
  arName: string;
};

export type seedersProps = {
  id?: string;
  name: string;
  arName: string;
};

export type membershipFormProps = {
  id?: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  noOfVisits: string | number;
};
