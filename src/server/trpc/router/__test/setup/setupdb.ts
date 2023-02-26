import User from '@/models/StaffMem';
import Company from '@/models/Company';
import Role from '@/models/Role';
import { Permissions } from '@/constants';

export const seedTestDB = async (db: typeof import('mongoose')) => {
  await db.connection.dropDatabase();

  const testCompany = new Company({
    name: 'Test Company',
    addressLine1: 'Test Address',
    addressLine2: 'Test Address',
    city: 'Test City',
    state: 'Test State',
    companyName: 'Test Company',
    country: 'Test Country',
    createdAt: new Date(),
    pincode: 'Test Pincode',
  });

  const testAdminRole = new Role({
    name: 'Test Admin Role',
    company: testCompany._id,
    createdAt: new Date(),
    permissions: Permissions.map((permission) => ({
      permissionName: permission,
      crud: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    })),
    displayName: 'Test Admin Role',
    users: [],
  });

  const user = new User({
    firstName: 'Test',
    middleName: 'Test',
    lastName: 'Test',
    email: 'test@gmail.com',
    password: 'test',
    addressline1: 'test',
    addressline2: 'test',
    city: 'test',
    state: 'test',
    phoneNumber: 'test',
    companyId: testCompany._id,
    createdAt: new Date(),
    country: 'test',
    pincode: 'test',
    role: testAdminRole._id,
  });

  testAdminRole.users.push(user._id);

  await testCompany.save();
  await testAdminRole.save();
  await user.save();
};
