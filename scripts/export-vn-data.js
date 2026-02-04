import fs from 'fs';
import {
  getAllProvinces,
  getAllDistricts
} from 'vietnam-provinces-js';

const provinces = getAllProvinces();
const districts = getAllDistricts();

fs.mkdirSync('public/data', { recursive: true });

fs.writeFileSync(
  'public/data/vn-provinces.json',
  JSON.stringify(provinces, null, 2)
);

fs.writeFileSync(
  'public/data/vn-districts.json',
  JSON.stringify(districts, null, 2)
);

console.log('✅ Export xong dữ liệu VN');
