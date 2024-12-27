import { Status } from "@constants/enum";
export type Credentials = {
  email: string;
  password: string;
};

export type Location = {
  latitude: number;
  longitude: number;
};
export type Verification = {
  id: string;
  verificationType: {
    name: string;
  };
  status: Status;
  of: {
    firstName: string;
    lastName: string;
    role: string;
  };
  lat?: number;
  long?: number;
  phone: number;
  address: string;
  pincode: string;
  creRemarks: string;
  feRemarks?: string;
  createdAt: string;
  updatedAt: string;
  documents: {
    id: string;
    name: string;
    url: string;
    employee: {
      role: string;
    };
  }[];
};
