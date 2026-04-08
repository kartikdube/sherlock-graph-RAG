import traces from '../data/traces.json';

export type PipelineResult = {
  answer: string;
  metrics: {
    latency: string;
    tokens: number;
  };
  steps: Array<{
    id: string;
    label: string;
    desc: string;
    data: any;
  }>;
};

/**
 * Dispatches a query to either the cached demo data or a live (placeholder) engine.
 * This architecture is 'honest' because it explicitly handles the demo vs live state.
 */
export async function executeQuery(
  query: string,
  mode: 'standard' | 'graph',
  isDemo: boolean
): Promise<PipelineResult> {
  // 1. Check for precomputed demo replays first
  if (isDemo) {
    const matched = traces.queries.find(q => q.query.toLowerCase() === query.toLowerCase());
    if (matched) {
      return (matched as any)[mode];
    }
  }

  // 2. Mock Live Inference (In a real app, this would hit the LLM/Vector DB)
  await new Promise(resolve => setTimeout(resolve, mode === 'graph' ? 1200 : 800)); // Simulate think time

  if (mode === 'standard') {
    return {
      answer: "A standard RAG response would be synthesized from matched chunks...",
      metrics: { latency: "840ms", tokens: 312 },
      steps: [
        { id: "s1", label: "Semantic Search", desc: "Similarity search in local vector store.", data: { query_vector: "[...]" } },
        { id: "s2", label: "Retrieve", desc: "Top-K chunks retrieved.", data: { count: 5 } }
      ]
    };
  } else {
    return {
      answer: "A GraphRAG response would be synthesized from graph nodes and community summaries...",
      metrics: { latency: "1.4s", tokens: 812 },
      steps: [
        { id: "g1", label: "Extraction", desc: "LLM extracting query entities.", data: { found: ["Sherlock"] } },
        { id: "g2", label: "Graph Walk", desc: "Querying adjacency list.", data: { hops: 1 } },
        { id: "g3", label: "Summarization", desc: "Injecting community reports.", data: { clusters: 1 } }
      ]
    };
  }
}
