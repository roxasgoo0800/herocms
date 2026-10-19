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

export interface SopStepDetail {
  stepNum: number;
  title: string;
  instruction: string;
  command?: string;
  note?: string;
}

export interface SopApiExample {
  title: string;
  service: string;
  endpoint: string;
  method: string;
  description: string;
  curl: string;
  goHandlerSnippet: string;
  responseSample: string;
}

export interface EnterpriseSop {
  id: string;
  title: string;
  category: string;
  pic: string;
  badge: string;
  purpose: string;
  flowchart: string[];
  steps: string[];
  dos: string[];
  donts: string[];
  commands: string[];
  apiExample?: SopApiExample;
  verificationCriteria: string[];
}

export interface BlueprintGolangImpl {
  file: string;
  explanation: string;
  codeSnippet: string;
}

export interface BlueprintApiEndpoint {
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  port: number;
  description: string;
  requestBody?: string;
  curlCommand: string;
  curl?: string;
  responseSample: string;
  howToTest: string[];
}

export interface ArchitectureBlueprint {
  id: string;
  term: string;
  category: string;
  service: string;
  serviceName: string;
  icon: string;
  definition: string;
  requirements: string[];
  fileReference: string;
  cliCommand: string;
  guideSteps: string[];
  doAndDont: string;
  flowchart: string[];
  inDepthExplanation: string;
  golangImplementation: BlueprintGolangImpl;
  apiEndpoint?: BlueprintApiEndpoint;
  dos: string[];
  donts: string[];
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
  version: string;
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
  totalPrds: number;
  totalSecurityPillars: number;
  totalJourneys: number;
}

export interface PrdCoreModule {
  name: string;
  desc: string;
  capabilities: string[];
}

export interface PrdApiContract {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  desc: string;
  samplePayload?: string;
  sampleResponse?: string;
}

export interface PrdNfrItem {
  metric: string;
  target: string;
  strategy: string;
}

export interface PrdRoadmapPhase {
  phase: string;
  title: string;
  timeline: string;
  deliverables: string[];
}

export interface PrdKpiItem {
  name: string;
  target: string;
}

export interface MicroservicePrd {
  id: string;
  serviceId: string;
  title: string;
  serviceName: string;
  badge: string;
  version: string;
  targetAudience: string[];
  techStack: {
    framework: string;
    language: string;
    runtime: string;
    databases: string[];
    keyLibraries: string[];
  };
  summary: string;
  coreModules: PrdCoreModule[];
  apiContracts: PrdApiContract[];
  nfrs: PrdNfrItem[];
  roadmap: PrdRoadmapPhase[];
  kpis: PrdKpiItem[];
}

export interface SecurityStandard {
  id: string;
  pillarNumber: number;
  title: string;
  category: 'sandboxing' | 'owasp' | 'database' | 'edge' | 'assets' | 'audit';
  badge: string;
  summary: string;
  threatVector: string;
  enforcement: string;
  codeFile: string;
  codeSnippet: string;
  verificationSteps: string[];
  checklist: string[];
}

export interface SystemJourneyStep {
  stepNum: number;
  actor: string;
  action: string;
  technicalDetail: string;
  outcome: string;
}

export interface SystemJourneyFailureMode {
  issue: string;
  detection: string;
  autoRecovery: string;
}

export interface SystemJourney {
  id: string;
  title: string;
  category: 'deployment' | 'routing' | 'database' | 'telemetry' | 'ai' | 'storage' | 'pwa';
  badge: string;
  latencySla: string;
  summary: string;
  actors: string[];
  steps: SystemJourneyStep[];
  failureModes: SystemJourneyFailureMode[];
  verificationCli: string;
}

