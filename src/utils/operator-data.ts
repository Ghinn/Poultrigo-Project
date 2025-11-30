// Utility functions for Operator Dashboard CRUD operations
// Stored in localStorage

export interface Kandang {
  id: string;
  name: string;
  population: number;
  age: number; // in days
  status: "Optimal" | "Peringatan" | "Kritis";
  createdAt: string;
  updatedAt: string;
}

export interface KandangHistory {
  id: string;
  kandangId: string;
  kandangName: string;
  action: "Created" | "Updated";
  population: number;
  age: number;
  timestamp: string;
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
const KANDANG_HISTORY_STORAGE_KEY = "poultrigo_kandang_history";
const DAILY_RECORDS_STORAGE_KEY = "poultrigo_daily_records";

// History CRUD
export function getKandangHistory(): KandangHistory[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KANDANG_HISTORY_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addKandangHistory(history: Omit<KandangHistory, "id">): KandangHistory {
  const histories = getKandangHistory();
  const newHistory: KandangHistory = {
    ...history,
    id: `H${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  histories.unshift(newHistory); // Add to beginning
  localStorage.setItem(KANDANG_HISTORY_STORAGE_KEY, JSON.stringify(histories));
  return newHistory;
}

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "A2",
        name: "Kandang A2",
        population: 1450,
        age: 20,
        status: "Peringatan",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "B1",
        name: "Kandang B1",
        population: 1600,
        age: 30,
        status: "Optimal",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "B2",
        name: "Kandang B2",
        population: 1550,
        age: 18,
        status: "Optimal",
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

  // Add History
  addKandangHistory({
    kandangId: newKandang.id,
    kandangName: newKandang.name,
    action: "Created",
    population: newKandang.population,
    age: newKandang.age,
    timestamp: new Date().toISOString(),
  });

  return newKandang;
}

export function updateKandang(kandangId: string, updates: Partial<Omit<Kandang, "id" | "createdAt">>): Kandang | null {
  if (typeof window === "undefined") return null;
  const kandangs = getKandangs();
  const kandangIndex = kandangs.findIndex((k) => k.id === kandangId);

  if (kandangIndex === -1) return null;

  const kandang = kandangs[kandangIndex];
  const updatedKandang = {
    ...kandang,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  kandangs[kandangIndex] = updatedKandang;

  localStorage.setItem(KANDANG_STORAGE_KEY, JSON.stringify(kandangs));

  // Add History
  addKandangHistory({
    kandangId: updatedKandang.id,
    kandangName: updatedKandang.name,
    action: "Updated",
    population: updatedKandang.population,
    age: updatedKandang.age,
    timestamp: new Date().toISOString(),
  });

  return updatedKandang;
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

// Device/Robot CRUD
export interface Device {
  id: string;
  name: string;
  type: "Feeder" | "Waterer" | "Cleaner" | "Sensor";
  status: "Active" | "Inactive" | "Maintenance";
  kandangId: string;
  batteryLevel: number;
  lastActive: string;
}

const DEVICE_STORAGE_KEY = "poultrigo_devices";

export function getDevices(): Device[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(DEVICE_STORAGE_KEY);
  if (!data) {
    // Default mock data
    const defaultDevices: Device[] = [
      {
        id: "DEV001",
        name: "Robot Pakan A1",
        type: "Feeder",
        status: "Active",
        kandangId: "A1",
        batteryLevel: 85,
        lastActive: new Date().toISOString(),
      },
      {
        id: "DEV002",
        name: "Sensor Suhu A1",
        type: "Sensor",
        status: "Active",
        kandangId: "A1",
        batteryLevel: 92,
        lastActive: new Date().toISOString(),
      },
    ];
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(defaultDevices));
    return defaultDevices;
  }
  return JSON.parse(data);
}

export function saveDevice(device: Omit<Device, "id">): Device {
  const devices = getDevices();
  const newDevice: Device = {
    ...device,
    id: `DEV${Date.now()}`,
  };
  devices.push(newDevice);
  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
  return newDevice;
}

export function updateDevice(deviceId: string, updates: Partial<Device>): Device | null {
  if (typeof window === "undefined") return null;
  const devices = getDevices();
  const index = devices.findIndex((d) => d.id === deviceId);

  if (index === -1) return null;

  const updatedDevice = { ...devices[index], ...updates };
  devices[index] = updatedDevice;
  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
  return updatedDevice;
}

export function deleteDevice(deviceId: string): boolean {
  if (typeof window === "undefined") return false;
  const devices = getDevices();
  const filtered = devices.filter((d) => d.id !== deviceId);

  if (filtered.length === devices.length) return false;

  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Prediction CRUD
export interface PredictionRecord {
  id: string;
  date: string;
  kandangId: string;
  kandangName: string;
  inputs: {
    age: number;
    gender: "Jantan" | "Betina";
    population: number;
    feedYesterday: number;
    leftover: number;
  };
  result: number;
  createdAt: string;
}

const PREDICTION_STORAGE_KEY = "poultrigo_predictions";

export function getPredictions(): PredictionRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PREDICTION_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function savePrediction(prediction: Omit<PredictionRecord, "id" | "createdAt">): PredictionRecord {
  const predictions = getPredictions();
  const newPrediction: PredictionRecord = {
    ...prediction,
    id: `PRED${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  predictions.unshift(newPrediction); // Add to beginning
  localStorage.setItem(PREDICTION_STORAGE_KEY, JSON.stringify(predictions));
  return newPrediction;
}


