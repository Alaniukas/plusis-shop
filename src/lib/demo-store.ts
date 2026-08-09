import fs from "fs";
import path from "path";
const dataDir = path.join(process.cwd(), "data");
export function appendDemoRecord(fileName: string, record: Record<string, unknown>) {
  fs.mkdirSync(dataDir, { recursive: true });
  const filePath = path.join(dataDir, fileName);
  const list: Record<string, unknown>[] = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : [];
  list.push({ ...record, createdAt: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
}