export interface Chunk {
  id: string;
  text: string;
  source: string;
  score?: number; // Similarity score for UI display
}

export interface Node {
  id: string;
  label: string;
  type: string;
  description: string;
}

export interface Edge {
  source: string;
  target: string;
  relation: string;
}

export interface Community {
  id: string;
  level: number;
  title: string;
  summary: string;
  memberNodeIds: string[];
}

export interface RetrievalStep {
  stepId: string;
  name: string;
  description: string;
  durationMs: number;
  dataPayload?: any; // E.g., Array of Chunks or Nodes depending on step type
}

export interface RetrievalTrace {
  pipeline: 'Standard' | 'Graph';
  steps: RetrievalStep[];
  finalAnswer: string;
  metrics: {
    latencyMs: number;
    tokensUsed: number;
  };
}

export interface QueryRecord {
  id: string;
  query: string;
  classification: 'Local' | 'Global' | 'Multi-hop';
  standardTrace: RetrievalTrace;
  graphTrace: RetrievalTrace;
}
