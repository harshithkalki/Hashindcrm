import { z } from 'zod';

export const ZCarCreateInput = z.object({
  make: z.string(),
  registrationNumber: z.string(),
  customer: z.string(),
  model: z.string().optional(),
  purchaseDate: z.string().optional(),
  vehicleType: z.string().optional(),
  meterReading: z.string().optional(),
  wheelDriveType: z.string().optional(),
  fuelType: z.string().optional(),
  transmissionType: z.string().optional(),
  emissionType: z.string().optional(),
  insuranceDate: z.string().optional(),
  insurancePeriod: z.number().optional(),
  renewalDate: z.string().optional(),
  interiorColor: z.string().optional(),
  exteriorColor: z.string().optional(),
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
