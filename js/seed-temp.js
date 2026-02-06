import { db } from "./firebase/firebase-init.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const statusEl = document.getElementById("status");
const seedBtn = document.getElementById("seed-btn");

seedBtn?.addEventListener("click", seedIfEmpty);

const contacts = {
  c001: { name: "Ava Muller", email: "ava.mueller@archer-systems.example", phone: "+49 30 1234 5678" },
  c002: { name: "Noah Richter", email: "noah.richter@archer-systems.example", phone: "+49 30 2345 6789" },
  c003: { name: "Lina Berg", email: "lina.berg@archer-systems.example", phone: "+49 30 3456 7890" },
  c004: { name: "Jonas Keller", email: "jonas.keller@archer-systems.example", phone: "+49 30 4567 8901" },
  c005: { name: "Sofia Weber", email: "sofia.weber@archer-systems.example", phone: "+49 30 5678 9012" },
  c006: { name: "Elias Braun", email: "elias.braun@archer-systems.example", phone: "+49 30 6789 0123" },
  c007: { name: "Mila Koenig", email: "mila.koenig@archer-systems.example", phone: "+49 30 7890 1234" },
  c008: { name: "Leo Hartmann", email: "leo.hartmann@archer-systems.example", phone: "+49 30 8901 2345" },
  c009: { name: "Hanna Wolf", email: "hanna.wolf@archer-systems.example", phone: "+49 30 9012 3456" },
  c010: { name: "Paul Neumann", email: "paul.neumann@archer-systems.example", phone: "+49 30 0123 4567" },
  c011: { name: "Lara Fischer", email: "lara.fischer@archer-systems.example", phone: "+49 30 1122 3344" },
  c012: { name: "Tom Schneider", email: "tom.schneider@archer-systems.example", phone: "+49 30 2233 4455" }
};

const tasks = {
  t001: {
    title: "Onboard new sales team",
    description: "Create onboarding checklist and access package for Q1 hires.",
    category: "User Story",
    dueDate: "2026-02-12",
    priority: "urgent",
    status: "to-do",
    subtasks: [
      { task: "Prepare access credentials", checked: "false" },
      { task: "Welcome call schedule", checked: "false" }
    ],
    assignedTo: ["c001", "c005"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  t002: {
    title: "Q1 analytics dashboard",
    description: "Build management dashboard with KPIs and export feature.",
    category: "Technical Task",
    dueDate: "2026-02-18",
    priority: "medium",
    status: "in-progress",
    subtasks: [
      { task: "Define KPI set", checked: "true" },
      { task: "Connect data sources", checked: "false" },
      { task: "Add export button", checked: "false" }
    ],
    assignedTo: ["c003", "c006"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8
  },
  t003: {
    title: "Customer feedback pipeline",
    description: "Collect and tag feedback from email and chat channels.",
    category: "Technical Task",
    dueDate: "2026-02-22",
    priority: "low",
    status: "await-feedback",
    subtasks: [
      { task: "Define tags", checked: "true" },
      { task: "Route chat feedback", checked: "false" }
    ],
    assignedTo: ["c004"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12
  },
  t004: {
    title: "Prepare investor demo",
    description: "Create story flow and visuals for Archer Systems pitch.",
    category: "User Story",
    dueDate: "2026-02-14",
    priority: "urgent",
    status: "in-progress",
    subtasks: [
      { task: "Narrative outline", checked: "true" },
      { task: "Slide mockups", checked: "false" },
      { task: "Demo data polish", checked: "false" }
    ],
    assignedTo: ["c001", "c007"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  t005: {
    title: "Security review",
    description: "Review auth flows and update password policy.",
    category: "Technical Task",
    dueDate: "2026-02-20",
    priority: "medium",
    status: "to-do",
    subtasks: [
      { task: "Threat model", checked: "false" },
      { task: "Policy update", checked: "false" }
    ],
    assignedTo: ["c006", "c010"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6
  },
  t006: {
    title: "Website content refresh",
    description: "Rewrite homepage copy and update customer logos.",
    category: "User Story",
    dueDate: "2026-03-01",
    priority: "low",
    status: "to-do",
    subtasks: [
      { task: "New copy draft", checked: "false" },
      { task: "Logo approvals", checked: "false" }
    ],
    assignedTo: ["c002", "c005"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10
  },
  t007: {
    title: "Partner API integration",
    description: "Sync project data with external partner CRM.",
    category: "Technical Task",
    dueDate: "2026-03-05",
    priority: "urgent",
    status: "await-feedback",
    subtasks: [
      { task: "Auth handshake", checked: "true" },
      { task: "Data mapping", checked: "true" },
      { task: "Error handling", checked: "false" }
    ],
    assignedTo: ["c003", "c009"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15
  },
  t008: {
    title: "Customer success playbook",
    description: "Document onboarding, training, and renewal playbook.",
    category: "User Story",
    dueDate: "2026-02-26",
    priority: "medium",
    status: "done",
    subtasks: [
      { task: "Draft outline", checked: "true" },
      { task: "Review with team", checked: "true" }
    ],
    assignedTo: ["c007", "c008"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20
  }
};

async function seedIfEmpty() {
  setStatus("Checking database...");
  const hasContacts = await existsAt("contacts");
  const hasTasks = await existsAt("tasks");
  if (hasContacts || hasTasks) {
    setStatus("Found existing data. Seed aborted to avoid overwrite.");
    return;
  }
  await writeDemoData();
}

async function writeDemoData() {
  await set(ref(db, "contacts"), contacts);
  await set(ref(db, "tasks"), tasks);
  setStatus("Demo data seeded successfully.");
}

async function existsAt(path) {
  const snap = await get(ref(db, path));
  return snap.exists();
}

function setStatus(msg) {
  if (statusEl) statusEl.textContent = `Status: ${msg}`;
}
