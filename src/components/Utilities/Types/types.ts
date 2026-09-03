import type { GetProp, UploadProps } from "antd";
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
  id?: string;
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
  notes?: string;
  cityName?: string;
  cityArName?: string;
  areaName?: string;
  areaArName?: string;
};
export type clientFormPropsType = {
  id?: number | string;
  firstName: string;
  name?: string;
  arName?: string;
  middleName: string;
  lastName: string;
  idNumber: string | number;
  phoneNumber?: string | number;
  customerTypeName?: string;
  noOfReservations?: string | number;
  lastReservationDate?: string;
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
  // memberShipNumber?: string;
  entryDate: string;
  customerAddresses: (addressProps & buildingProps)[];
  address?: (addressProps & buildingProps)[];
  customerFavourites: {
    favoriteList?:
      | {
          workerId: number | string | null;
          name?: string,
          arName?: string
        }[]
      | number[];
    notRecommendedWorkerList?:
      | {
          workerId: number | string | null;
          name?: string,
          arName?: string
        }[]
      | number[];
  };
  // favoriteList?:
  //   | {
  //       value: string | null;
  //     }[]
  //   | string[];
  // NotRecommendedWorkerList?:
  //   | {
  //       value: string | null;
  //     }[]
  //   | string[];
  // notRecommendedWorkerList?:
  //   | {
  //       value: string | null;
  //     }[]
  //   | string[];
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
  packageTypeId: string;
  Title: string;
  ArTitle: string;
  SubTitle: string;
  ArSubTitle: string;
  subTitlearSubTitle?: string;
  Description: string;
  IsPercentage: string;
  isPercentage: string;
  Discount: string;
  // WhatYouWillHaveOnIt: string;
  // WhatYouwouldntHaveOnIt: string;
  ToolIds: (string | number)[];
  SupplyIds: (string | number)[];
  MachineIds: (string | number)[];
  Rules: { value: string }[];
  Logo: string | File;
  // workingHours: string;
  NumberofRooms: string;
  NumberofWorkers: string;
  Price?: string;
  CleaningAreaDetails: {
    CleaningAreaId: string;
    ArName: string;
    Name: string;
    Description: string;
    CleaningAreaServiceIds?: (string | number)[];
  }[];
  cleaningAreaDetails?: {
    CleaningAreaId: string;
    ArName: string;
    Name: string;
    Description: string;
    CleaningAreaServiceIds?: (string | number)[];
  }[];
  ExtraServices: {
    ArName: string;
    Name: string;
    Price: string | number;
    numberOfWorkers: string | number;
  }[];
  // TransportationFees: { Fee: string; CityId: string }[];
};

// this type for card only
export type packageCard = {
  packageTypeId: string;
  id: string | number;
  title: string;
  arTitle: string;
  subTitle: string;
  subTitlearSubTitle?: string;
  arSubTitle: string;
  description: string;
  IsPercentage: string;
  isPercentage: string;
  Discount: string;
  discount: string | number;
  packageTypeName?: string;
  packageTypeArName?: string;
  tools: packageToolItem[];
  supplies: packageToolItem[];
  machines: packageToolItem[];
  rules: string[];
  logo: string;
  isActive: boolean;
  // workingHours: string;
  numberofRooms: string;
  numberOfRooms?: string;
  numberofWorkers: string;
  numberOfWorkers?: string;
  price: string;
  CleaningAreaDetails: {
    CleaningAreaId: string;
    ArName: string;
    Name: string;
  }[];
  cleaningAreaDetails?: {
    id: string | number;
    cleaningAreaId: string;
    arName: string;
    name: string;
    description: string;
    cleaningAreaServices?: {
      id: string | number;
      name: string;
      arName: string;
    }[];
  }[];
  extraServices?: {
    arName: string;
    name: string;
    price: string | number;
    numberOfWorkers?: string | number;
    id?: string | number;
  }[];
  // transportationFees: { id?: string; fee: string; cityId: string }[];
};

export type appointmentProps = {
  date: string;
  startTime: string;
  endTime: string;
};

export type reservationFormProps = {
  customerId: string | number;
  customerAddressId: string | number | null;
  duration: string[];
  customerName?: string;
  insects: string | boolean;
  rodents: string | boolean;
  reservationDate: string;
  transportationFeesId: string | number | null;
  fee?: string | number | null;
  totalReservationAmount?: number;
  serviceTypeId?: string | number | null;
  onSpot: boolean;
  apartmentClosingPeriodId: string | number;
  generalComments: string;
  cityId?: string | null;
  areaId?: string | null;
  addReservationPackagesDtos?: {
    packageId: string | number;
    count: string | number;
    packageAmount: string | number;
    reservationPackageExtraServices?: {
      packageExtraServiceId: string | number;
    }[];
  }[];
  getTransportationFeesDetails?: {
    fee: number | string;
    cityId: string | null;
    areaId: string | null;
    id: string | number;
  };
} & clientFormPropsType &
  appointmentProps &
  buildingProps &
  extraServiceProps;

// Shape consumed by the Calendar page (react-big-calendar events).
export type calendarReservationProps = {
  id: string | number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  serviceType?: string;
  reservationDate: string; // ISO start date-time
  endDate?: string; // ISO end date-time (optional; defaults to +1h client-side)
  isConfirmed?: boolean;
  isActive?: boolean;
};

export type reservationDetailsData = {
  id: number;
  reservationDate: string;
  reservationAmount: number;
  serviceTypeId?: string | number | null;
  customerId: number;
  customerName: string;
  customerAddressId: number;
  customerAddressName: string;
  customerNationalId?: string;
  customerPhoneNumbers: {
    phoneNumber: string;
    id: number;
  }[];
  reservationWorkers: {
    workerId: number | string;
    workerName: string;
    workerArName: string;
  }[];
  // customer extra info
  firstName?: string;
  middleName?: string;
  lastName?: string;
  customerTypeName?: string;
  hasMembership?: boolean;
  // memberShipNumber?: string;
  whatsAppNumber?: string | number;
  isOld?: boolean;
  noOfReservations?: string | number;
  lastReservationDate?: string;
  generalNotes?: string;
  customerFavourites?: {
    favoriteList?: { workerId: number | string | null }[] | number[];
    notRecommendedWorkerList?:
      | { workerId: number | string | null }[]
      | number[];
  };
  idNumber?: string;
  phoneNumber?: string;
  email?: string;
  city?: string;
  area?: string;
  street?: string;
  apartment?: string;
  floor?: string;
  postalCode?: string;
  // address extra info
  landMark?: string;
  fullDescription?: string;
  notes?: string;
  numberOfKitchens?: string | number;
  numberOfBedrooms?: string | number;
  numberOfLivingRooms?: string | number;
  numberOfBathrooms?: string | number;
  numberOfReceptionrooms?: string | number;
  noOfFloors?: string | number;
  hasPets?: boolean;
  rodents: boolean;
  insects: boolean;
  generalComments: string;
  apartmentClosingPeriod: string;
  apartmentClosingPeriodId: number;
  space?: string;
  buildingType?: string;
  state?: string;
  landType?: string;
  numberOfWindows?: number;
  numberOfWorkers?: number;
  brideCleansUp?: boolean;
  visitDuration?: string;
  startTime?: string;
  endTime?: string;
  cityName?: string;
  areaName?: string;
  onSpot: boolean;
  isConfirmed : boolean;
  getPackageDtoList: {
    count: number;
    packageAmount: number;
    reservationPackageExtraServices: {
      id: number;
      service: string;
      price: number;
    }[];
    getPackageDto: {
      id: number;
      title: string;
      arTitle: string;
      subTitle: string;
      arSubTitle: string;
      description: string;
      tools: string;
      supplies: string;
      rules: string[] | null;
      discount: number;
      isPercentage: boolean;
      numberOfWorkers: number;
      numberOfRooms: number;
      price: number;
      packageTypeId: number;
      packageTypeName: string | null;
      packageTypeArName: string | null;
      termsAndConditions: string;
      logo: string;
      isActive: boolean;
      cleaningAreaDetails: {
        id: number;
        name: string;
        arName: string;
      }[];
      extraServices: {
        id: number;
        name: string;
        arName: string;
        price: number;
      }[];
    };
  }[];
  getTransportationFeesDetails?: {
    fee: number | string;
    cityId: string | null;
    areaId: string | null;
    id: string | number;
  };
};
export type workersFormProps = {
  id?: string;
  name: string;
  arName: string;
  phoneNumbers: string[];
  nationalId: string;
  isMale: boolean | string | undefined;
  isWorker?: boolean | string | undefined;
};

export type assignWorkerFormProps = {
  workers:
    | {
        workerId: string | number;
      }[]
    | [];
};
export type holdReservationProps = {
  dateFrom: string;
  dateTo: string;
};

export type serviceFormProps = {
  id?: string | number | null;
  title?: string;
  arTitle?: string;
  description?: string;
  package?: string;
  isActive?:boolean
  isConfirmed?: boolean;
  extraServices?:
    | {
        extraServiceId: string | number;
      }[]
    | null;
  packages?: {
    packageId: string | number;
    packageName?: string;
    packageArName?: string;
  }[];
  reservationWorkers?: {
    workerId: string | number;
    workerName: string;
    workerArName: string;
  }[];
};

export type messagesProps = {
  title: string;
  message: string;
  customerIds: string[] | number[];
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

export type toolProps = {
  id?: number | string;
  name: string;
  arName?: string;
  type: string;
  isActive?: boolean;
};

export type packageToolItem = {
  id: number | string;
  name: string;
  arName?: string;
};

export type cleaningAreaServiceProps = {
  id?: number | string;
  name: string;
  arName: string;
  active: boolean;
};

export type membershipFormProps = {
  id?: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  noOfVisits: string | number;
  percent: number;
};
export type transportationFeesProps = {
  id?: string | number;
  fee: string | number;
  cityId: string | number;
  areaId: string | number;
  name: string;
  arName: string;
  city?: {
    id: string | number;
    name: string;
    arName: string;
  };
  area?: {
    id: string | number;
    name: string;
    arName: string;
  };
};

export type extraServiceProps = {
  id: string;
  name: string;
  arName: string;
  price: string | number;
  numberOfWorkers?: string | number;
};

export type customerAddressDDLProps = {
  id: string | number;
  name?: string;
  cityId?: string | number;
  areaId?: string | number;
  street?: string;
  apartment?: string;
  floor?: string | number;
  landMark?: string;
  fullDescription?: string;
  notes?: string;
  space?: string | number;
  numberOfKitchens?: string | number;
  numberOfBedrooms?: string | number;
  numberOfLivingRooms?: string | number;
  numberOfBathrooms?: string | number;
  numberOfReceptionrooms?: string | number;
  noOfFloors?: string | number;
  hasPets?: boolean;
  numberOfWindows?: string | number;
};

export type reservationCustomerDataProps = {
  id?: string | number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  idNumber?: string | number;
  email?: string;
  phoneNumbers?: { id?: string | number; phoneNumber: string | number }[];
  generalNotes?: string;
  customerTypeName?: string;
  hasMembership?: boolean;
  memberShipNumber?: string;
  whatsAppNumber?: string | number;
  isOld?: boolean;
  noOfReservations?: string | number;
  lastReservationDate?: string;
  customerFavourites?: {
    favoriteList?: { workerId: number | string | null }[] | number[];
    notRecommendedWorkerList?:
      | { workerId: number | string | null }[]
      | number[];
  };
};

export type transportationFeesFormProps = {
  id?: string | number;
  fee: string | number;
  cityId: string | number;
  areaId: string | number;
  areaName?: string;
  areaArName?: string;
  cityName?: string;
  cityArName?: string;
};

export type mostRecentCustomersProps = {
  id: number;
  name: string;
  arName: string;
};

export type mostUsedPackage = {
  id: number;
  name: string;
  usageCount: number;
  usagePercent: number;
};

export type complaintFormProps = {
  reservationId: string | number;
  comment: string;
  workerIds?: (string | number)[];
};

export type complaintWorkerProps = {
  workerId: string | number;
  workerName: string;
  workerArName: string;
};

export type complaintResponseProps = {
  id: string | number;
  reservationId: string | number;
  customerId?: string | number;
  comment: string;
  createdBy?: string;
  createdAt?: string;
  creationDate?: string;
  workers?: complaintWorkerProps[];
};

export type feedbackFormProps = {
  reservationId: string | number;
  rate: number;
  comment: string;
};

export type feedbackResponseProps = {
  id: string | number;
  reservationId: string | number;
  rate: number;
  comment: string;
  createdBy?: string;
  creationDate?: string;
};

export type workerManagementFormProps = {
  startDate: string;
  endDate: string;
  workersNo: number;
  notes?: string;
};

export type workerManagementResponseProps = {
  id: string | number;
  startDate?: string;
  endDate?: string;
  workersNo?: number;
  availableNoWorkers?: number;
  remainNoOfWorkers?: number;
  date?: string;
  notes?: string;
  creationDate?: string;
};

export type workerManagementEditProps = {
  id: string | number;
  availableNoWorkers: number;
  remainNoOfWorkers: number;
  notes?: string;
};

export type workerManagementGroupEditProps = {
  ids: (string | number)[];
  availableNoWorkers: number;
  remainNoOfWorkers: number;
  notes?: string;
};

export type workerManagementFilterParams = {
  from: string;
  to: string;
};

export type reservationPaymentsProps = {
  reservationId: string | number;
  type: string;
  amount: number;
  operationDate: string;
  paymentMethod: string;
  note: string;
};

/* ── Daily reservation report ─────────────────────────────────────────────
   The API returns section `items` and `reservations` as free-form rows, so
   every field is optional and unknown keys are tolerated: the report UI
   renders whichever fields are actually present. */
export type dailyReportItemProps = {
  id?: string | number;
  reservationId?: string | number;
  customerName?: string;
  customerPhoneNumber?: string;
  phoneNumber?: string;
  reservationDate?: string;
  time?: string;
  cityName?: string;
  areaName?: string;
  address?: string;
  packageName?: string;
  numberOfWorkers?: number;
  workers?: string;
  amount?: number;
  totalAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  status?: string;
  isConfirmed?: boolean;
  onSpot?: boolean;
  notes?: string;
  [key: string]: unknown;
};

export type dailyReportSectionProps = {
  key: string;
  title: string;
  items: dailyReportItemProps[];
};

export type dailyReservationReportProps = {
  reportDate: string;
  dayName: string;
  generatedAt: string;
  totalReservations: number;
  contractCount: number;
  confirmedCount: number;
  onSpotCount: number;
  cancelledCount: number;
  totalWorkers: number;
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  sections: dailyReportSectionProps[];
  reservations: dailyReportItemProps[];
};

export type dailyReportFilterParams = {
  dateFilter?: string;
  searchKey?: string;
  status?: string;
  area?: string;
};
