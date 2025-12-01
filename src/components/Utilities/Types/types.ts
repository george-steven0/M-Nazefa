import type { GetProp, UploadFile, UploadProps } from "antd";
import type { ApexOptions } from "apexcharts";
import type { TFunction } from "i18next";

export type translationType = {
  t: TFunction;
};

export type ChartState = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options: ApexOptions;
};
export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export type employeeFormProps = {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string | number;
  email: string;
  dateOfBirth: string;
  role: string;
  workId: string;
  startingDate: string;
  idNumber: string | number;
  postalCode: string;
  address: string;
  image: string | File;
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
  city: string;
  area: string;
  street: string;
  apartment: string;
  floor: string;
  postalCode: string;
  landmark: string;
  description: string;
};
export type clientFormPropsType = {
  firstName: string;
  middleName: string;
  lastName: string;
  idNumber: string | number;
  phoneNumber: string | number;
  email: string;
  addresses: (addressProps & buildingProps)[];
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
