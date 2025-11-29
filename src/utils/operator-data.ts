// Utility functions for Operator Dashboard CRUD operations
// Stored in localStorage

export interface Kandang {
  id: string;
  name: string;
  population: number;
  age: number; // in days
  status: "Optimal" | "Peringatan" | "Kritis";
  temp: string;
  humidity: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyRecord {
  id: string;
  date: string;
  kandangId: string;
  kandangName: string;
  task: string;
  time: string;
  status: "Selesai" | "Menunggu" | "Terlewat";
  notes?: string;
  createdAt: string;
}

const KANDANG_STORAGE_KEY = "poultrigo_kandang";
const DAILY_RECORDS_STORAGE_KEY = "poultrigo_daily_records";

// Kandang CRUD
export function getKandangs(): Kandang[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KANDANG_STORAGE_KEY);
  if (!data) {
    // Initialize with default data
    const defaultKandangs: Kandang[] = [
      {
        id: "A1",
        name: "Kandang A1",
        population: 1500,
        age: 25,
        status: "Optimal",
        temp: "28°C",
        humidity: "65%",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "A2",
        name: "Kandang A2",
        population: 1450,
        age: 20,
        status: "Peringatan",
        temp: "31°C",
        humidity: "70%",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "B1",
        name: "Kandang B1",
        population: 1600,
        age: 30,
        status: "Optimal",
        temp: "27°C",
        humidity: "63%",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "B2",
        name: "Kandang B2",
        population: 1550,
        age: 18,
        status: "Optimal",
        temp: "28°C",
        humidity: "66%",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(KANDANG_STORAGE_KEY, JSON.stringify(defaultKandangs));
    return defaultKandangs;
  }
  return JSON.parse(data);
}

export function saveKandang(kandang: Omit<Kandang, "id" | "createdAt" | "updatedAt">): Kandang {
  const kandangs = getKandangs();
  const newKandang: Kandang = {
    ...kandang,
    id: `K${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  kandangs.push(newKandang);
  localStorage.setItem(KANDANG_STORAGE_KEY, JSON.stringify(kandangs));
  return newKandang;
}

export function updateKandang(kandangId: string, updates: Partial<Omit<Kandang, "id" | "createdAt">>): Kandang | null {
  if (typeof window === "undefined") return null;
  const kandangs = getKandangs();
  const kandangIndex = kandangs.findIndex((k) => k.id === kandangId);
  
  if (kandangIndex === -1) return null;
  
  const kandang = kandangs[kandangIndex];
  kandangs[kandangIndex] = {
    ...kandang,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(KANDANG_STORAGE_KEY, JSON.stringify(kandangs));
  return kandangs[kandangIndex];
}

export function deleteKandang(kandangId: string): boolean {
  if (typeof window === "undefined") return false;
  const kandangs = getKandangs();
  const filteredKandangs = kandangs.filter((k) => k.id !== kandangId);
  
  if (filteredKandangs.length === kandangs.length) return false;
  
  localStorage.setItem(KANDANG_STORAGE_KEY, JSON.stringify(filteredKandangs));
  return true;
}

export function getKandangById(kandangId: string): Kandang | undefined {
  const kandangs = getKandangs();
  return kandangs.find((k) => k.id === kandangId);
}

// Daily Records CRUD
export function getDailyRecords(): DailyRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(DAILY_RECORDS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getDailyRecordsByDate(date: string): DailyRecord[] {
  const records = getDailyRecords();
  return records.filter((r) => r.date === date);
}

export function saveDailyRecord(record: Omit<DailyRecord, "id" | "createdAt">): DailyRecord {
  const records = getDailyRecords();
  const newRecord: DailyRecord = {
    ...record,
    id: `DR${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  localStorage.setItem(DAILY_RECORDS_STORAGE_KEY, JSON.stringify(records));
  return newRecord;
}

export function updateDailyRecord(recordId: string, updates: Partial<Omit<DailyRecord, "id" | "createdAt">>): DailyRecord | null {
  if (typeof window === "undefined") return null;
  const records = getDailyRecords();
  const recordIndex = records.findIndex((r) => r.id === recordId);
  
  if (recordIndex === -1) return null;
  
  records[recordIndex] = {
    ...records[recordIndex],
    ...updates,
  };
  
  localStorage.setItem(DAILY_RECORDS_STORAGE_KEY, JSON.stringify(records));
  return records[recordIndex];
}

export function deleteDailyRecord(recordId: string): boolean {
  if (typeof window === "undefined") return false;
  const records = getDailyRecords();
  const filteredRecords = records.filter((r) => r.id !== recordId);
  
  if (filteredRecords.length === records.length) return false;
  
  localStorage.setItem(DAILY_RECORDS_STORAGE_KEY, JSON.stringify(filteredRecords));
  return true;
}

export function getDailyRecordById(recordId: string): DailyRecord | undefined {
  const records = getDailyRecords();
  return records.find((r) => r.id === recordId);
}


