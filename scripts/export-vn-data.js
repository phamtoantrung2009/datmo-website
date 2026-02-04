import fs from "fs";
import path from "path";

import { getAllProvinces } from "vietnam-provinces-js/provinces";
import { getAllDistricts } from "vietnam-provinces-js/districts";

const provinces = await getAllProvinces();
const districts = await getAllDistricts();

const data = provinces.map((p) => ({
  code: p.idProvince,
  name: p.name,
  districts: districts
    .filter((d) => d.idProvince === p.idProvince)
    .map((d) => ({
      code: d.idDistrict,
      name: d.name,
    })),
}));

const outDir = path.resolve("public/data");
const outFile = path.join(outDir, "vietnam-provinces.json");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(data, null, 2), "utf-8");

console.log("✅ Exported vietnam-provinces.json → public/data/");
