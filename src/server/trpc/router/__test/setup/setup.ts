import { seedTestDB } from './setupdb';
import connectDb from '../../../../db';

const setup = async () => {
  const mongo = await connectDb();
  try {
    await seedTestDB(mongo);
    await mongo.disconnect();
  } catch (err) {
    console.error(err);
    await mongo.disconnect();
  }
};

export { setup };
