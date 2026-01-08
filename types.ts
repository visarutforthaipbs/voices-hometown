export interface Policy {
  id: string;
  title: string;
  description: string;
  focus: string;
  iconName: string;
  examples?: string;
}

export interface LocationData {
  subdistrict: string;
  district: string;
  province: string;
  zipcode: string;
  region?: string;
}

export interface VoteResult {
  policyId: string;
  votes: number;
}

declare module "*.json" {
  const value: any;
  export default value;
}