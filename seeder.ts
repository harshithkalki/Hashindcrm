import User from './src/models/User';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Role from './src/models/Role';
import { Permissions } from './src/constants';

dotenv.config({ path: __dirname + '/.env' });

async function start() {
  mongoose
    .connect(process.env.MONGODB_URI || '', {})
    .then(() => console.log('DB Connected'))
    .catch((error) => console.log('DB Connection Failed', error.message));

  const defaultSuperAdminRole = {
    name: 'super-admin',
    permissions: Permissions.map((permission) => ({
      permissionName: permission,
      crud: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    })),
    displayName: 'Super Admin',
  };

  const defaultSuperAdmin = {
    firstName: 'Super',
    lastName: 'Admin',
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
    addressline1: 'addressline1',
    city: 'city',
    state: 'state',
    country: 'country',
    pincode: 'pincode',
    phoneNumber: 'number',
  };

  const importData = async () => {
    try {
      if (await User.exists({ email: process.env.SUPER_ADMIN_EMAIL })) {
        console.log('Data already imported');
        process.exit();
      }

      const superAdminRole = await Role.create({
        ...defaultSuperAdminRole,
        company: new mongoose.Types.ObjectId(),
      });

      await User.create({
        ...defaultSuperAdmin,
        role: superAdminRole._id,
        companyId: superAdminRole.company,
      });

      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

  importData();
}

start();
