import { z } from 'zod';

export const ZCarCreateInput = z.object({
  maker: z.string(),
  model: z.string(),
  purchaseDate: z.string(),
  registrationNumber: z.string(),
  vehicleType: z.string(),
  meterReading: z.string(),
  wheelDriveType: z.string(),
  fuelType: z.string(),
  transmissionType: z.string(),
  emissionType: z.string(),
  insuranceDate: z.string(),
  insurancePeriod: z.string(),
  renewalDate: z.string(),
  interiorColor: z.string(),
  exteriorColor: z.string(),
  customer: z.string(),
});

export type CarCreateInput = z.infer<typeof ZCarCreateInput>;

export const ZCarUpdateInput = ZCarCreateInput.partial().extend({
  _id: z.string(),
});

export type CarUpdateInput = z.infer<typeof ZCarUpdateInput>;

export const ZCar = ZCarCreateInput.extend({
  company: z.string(),
  _id: z.string(),
});

export type Car = z.infer<typeof ZCar>;
