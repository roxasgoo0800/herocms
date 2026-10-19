export interface ChecklistItem {
  id?: number;
  text: string;
  done: boolean;
}

export interface TaskItem {
  id: string;
  division: string;
  pic: string;
  handoverTo: string;
  title: string;
  category: string;
  service: string;
  serviceGroup: string;
  codeFile: string;
  codeLang: string;
  status: 'ONGOING' | 'DONE';
  priority: string;
  phase: string;
  lead: string;
  flowDesc: string;
  flowDiagram: string;
  checklist: ChecklistItem[];
  codeSnippet: string;
  aiNotes: string;
  dod: string;
}

export interface ArchitectureBlueprint {
  term: string;
  category: string;
  icon: string;
  definition: string;
  requirements: string[];
  fileReference: string;
  cliCommand: string;
  guideSteps: string[];
  doAndDont: string;
}

export interface EnterpriseSop {
  id: string;
  title: string;
  category: string;
  pic: string;
  badge: string;
  steps: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  pic: string;
  icon: string;
  handover: string;
  focus: string;
  responsibilities: string;
}

export interface MicroserviceMeta {
  id: string;
  name: string;
  path: string;
  stack: string;
  pic: string;
  icon: string;
  lead: string;
  mandates: string[];
  forbidden: string[];
}

export interface TelemetryStats {
  totalTasks: number;
  ongoingTasks: number;
  totalServices: number;
  totalMembers: number;
  totalBlueprints: number;
  totalSops: number;
}
