import { getMentors } from './src/lib/mentors';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const result1 = await getMentors(1, 10, { search: '' });
  console.log('No filter total:', result1.totalCount);

  const result2 = await getMentors(1, 10, { search: 'biology' });
  console.log('Filter biology total:', result2.totalCount);
}
run().catch(console.error);
