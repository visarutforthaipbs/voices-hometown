import { LocationData } from '../types';
import rawData from './thailand.postcodes.json';

export const lookupPostcode = (zip: string): LocationData[] => {
  // Safe check if rawData is loaded as array
  const data = Array.isArray(rawData) ? rawData : [];

  const matches = (data as any[]).filter(item => item.postcode === zip);

  if (!matches || matches.length === 0) {
    return [];
  }

  // Remove duplicates based on subdistrict and district to avoid clutter
  const uniqueMatches = matches.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.subdistrict === item.subdistrict && t.district === item.district
    ))
  );

  return uniqueMatches.map(m => ({
    subdistrict: m.subdistrict,
    district: m.district,
    province: m.province,
    zipcode: m.postcode,
    region: m.region
  }));
};