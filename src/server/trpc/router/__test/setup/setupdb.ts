import StaffMem from '@/models/StaffMem';
import Company from '@/models/Company';
import Role from '@/models/Role';
import { Permissions } from '@/constants';

export const seedTestDB = async () => {
  await Company.deleteMany({});
  await Role.deleteMany({});
  await StaffMem.deleteMany({});

  const testCompany = new Company({
    name: 'Test Company',
    addressline1: 'Test Address',
    addressline2: 'Test Address',
    city: 'Test City',
    state: 'Test State',
    companyName: 'Test Company',
    country: 'Test Country',
    createdAt: new Date(),
    pincode: 'Test Pincode',
    backgroundColor: 'Test Color',
    logo: 'Test Logo',
    cinNo: 'Test CIN',
    gstNo: 'Test GST',
    secondaryColor: 'Test Color',
    primaryColor: 'Test Color',
    landline: 'Test Landline',
    mobile: 'Test Mobile',
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

  const staff = new StaffMem({
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

  testAdminRole.users.push(staff._id);

  try {
    await testCompany.save();
    await testAdminRole.save();
    await staff.save();

    process.env.TEST_COMPANY_ID = testCompany._id.toString();
    process.env.TEST_ADMIN_ROLE_ID = testAdminRole._id.toString();
    process.env.TEST_STAFF_ID = staff._id.toString();
  } catch (error) {
    console.log(error);
  }
};
