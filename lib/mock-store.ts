import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const runtimeDir = path.join(process.cwd(), "data", "runtime");
const mockDbPath = path.join(runtimeDir, "mock-db.json");

export type MockMediaAsset = {
  id: string;
  testimonialId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  department: string;
  treatmentTag: string;
  approvalStatus: string;
  consentAttached: boolean;
};

export type MockLeadOverride = {
  id: string;
  patientName: string;
  phone: string;
  city: string;
  treatmentInterest: string;
  source: string;
  assignedTo: string;
  status: string;
  pipelineStage: string;
  nextFollowUp: string;
};

export type MockTestimonialOverride = {
  id: string;
  requestStatus: string;
  consent: string;
  approval: string;
  publicationStatus: string;
  owner: string;
  notes: string;
  type: string;
};

export type MockUser = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "MARKETING" | "COUNSELOR" | "CONTENT";
  isActive: boolean;
  passwordHash: string;
};

type MockDbShape = {
  mediaAssets: MockMediaAsset[];
  leadOverrides: MockLeadOverride[];
  testimonialOverrides: MockTestimonialOverride[];
  users: MockUser[];
};

async function ensureStore() {
  await mkdir(runtimeDir, { recursive: true });

  try {
    await readFile(mockDbPath, "utf8");
  } catch {
    const initialData: MockDbShape = {
      mediaAssets: [],
      leadOverrides: [],
      testimonialOverrides: [],
      users: []
    };
    await writeFile(mockDbPath, JSON.stringify(initialData, null, 2), "utf8");
  }
}

async function readStore(): Promise<MockDbShape> {
  await ensureStore();
  const raw = await readFile(mockDbPath, "utf8");
  const parsed = JSON.parse(raw) as Partial<MockDbShape>;
  return {
    mediaAssets: parsed.mediaAssets ?? [],
    leadOverrides: parsed.leadOverrides ?? [],
    testimonialOverrides: parsed.testimonialOverrides ?? [],
    users: parsed.users ?? []
  };
}

async function writeStore(data: MockDbShape) {
  await ensureStore();
  await writeFile(mockDbPath, JSON.stringify(data, null, 2), "utf8");
}

export async function getMockMediaAssets(testimonialId: string) {
  const store = await readStore();
  return store.mediaAssets.filter((asset) => asset.testimonialId === testimonialId);
}

export async function appendMockMediaAsset(asset: MockMediaAsset) {
  const store = await readStore();
  store.mediaAssets.unshift(asset);
  await writeStore(store);
  return asset;
}

export async function getMockLeadOverride(id: string) {
  const store = await readStore();
  return store.leadOverrides.find((item) => item.id === id) ?? null;
}

export async function upsertMockLeadOverride(lead: MockLeadOverride) {
  const store = await readStore();
  const index = store.leadOverrides.findIndex((item) => item.id === lead.id);
  if (index >= 0) {
    store.leadOverrides[index] = lead;
  } else {
    store.leadOverrides.unshift(lead);
  }
  await writeStore(store);
  return lead;
}

export async function getMockTestimonialOverride(id: string) {
  const store = await readStore();
  return store.testimonialOverrides.find((item) => item.id === id) ?? null;
}

export async function upsertMockTestimonialOverride(testimonial: MockTestimonialOverride) {
  const store = await readStore();
  const index = store.testimonialOverrides.findIndex((item) => item.id === testimonial.id);
  if (index >= 0) {
    store.testimonialOverrides[index] = testimonial;
  } else {
    store.testimonialOverrides.unshift(testimonial);
  }
  await writeStore(store);
  return testimonial;
}

export async function getMockUsers() {
  const store = await readStore();
  return store.users;
}

export async function upsertMockUser(user: MockUser) {
  const store = await readStore();
  const index = store.users.findIndex((item) => item.id === user.id);
  if (index >= 0) {
    store.users[index] = user;
  } else {
    store.users.unshift(user);
  }
  await writeStore(store);
  return user;
}
