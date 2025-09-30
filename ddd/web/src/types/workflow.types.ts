export interface Workflow {
  id: string;
  name: string;
  contextId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  logs: string[];
  generatedFiles?: GeneratedFile[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  diff?: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  targetContextId: string;
  proposedChanges?: ProposedChanges;
  status: 'draft' | 'mapped' | 'approved' | 'in_progress' | 'completed';
  createdAt: Date;
}

export interface ProposedChanges {
  newAggregates: string[];
  modifiedAggregates: string[];
  newCommands: string[];
  newEvents: string[];
  newBusinessRules: string[];
  integrations: string[];
}