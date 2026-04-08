# Sherlock GraphRAG: Premium MVP Build-Ready Spec

## 1. Final MVP Definition
**Included in v1:**
- **Thematic Corpus:** The complete text of "A Scandal in Bohemia" and "The Red-Headed League".
- **Dual Pipeline Visualizer:** Side-by-side execution trace showing Standard RAG vs. GraphRAG.
- **Inspectable Retrieval Steps:** Clickable timeline steps revealing raw chunks, entity nodes, and community summaries.
- **Precomputed Demo Mode:** 6 "Gold Standard" queries (2 Local, 2 Global, 2 Multi-hop) with cached high-quality traces.
- **Live Inference Support:** Ability to type a custom query (requires user OpenAI API Key).
- **Simplified Graph Schema:** Entity/Relationship extraction + Leiden Community Detection + LLM community summarization.

**Deferred to v2:**
- Full book indexing (limited to 2-3 stories for performance).
- Real-time 3D Graph visualization (using list-based/2D node expanders instead for MVP).
- Multiple LLM provider support (locked to OpenAI `gpt-4o-mini` for MVP).

## 2. UI/UX Concept
- **Visual Style:** "Consulting Detective" Aesthetic. Sleek dark mode (`#0A0F1C`), translucent glassmorphism cards, and high-contrast accents (Teal for RAG, Gold for GraphRAG).
- **Hero Layout:** A centralized top search bar with a "Question Classification" badge that updates as the system "analyzes" the query.
- **The Split View:** 
    - **Left (Standard RAG):** Linear flow. Vertical dots connected by a single line. 
    - **Right (GraphRAG):** Branching flow. Vertical dots that expand horizontally into sub-nodes to represent graph expansion.
- **Interactions:**
    - **Sequence Animation:** Steps reveal one-by-one with a "typing/thinking" effect.
    - **Artifact Popovers:** Hover on a "Retrieved Chunk" to see the full text highlighted. Hover on an "Entity" node to see its description and relationships.
- **Essential Micro-animations:** Progress bars for embedding, "pulsing" nodes during graph traversal.

## 3. Query Experience
**Grouped Queries:**
- **Local (Fact Lookup):** "What was the name of the pawnbroker's assistant?" (Standard RAG wins).
- **Multi-hop:** "How did the clue at the pawn shop lead Holmes to the bank vault?" (GraphRAG connects entities).
- **Global (Thematic):** "What recurring methods does Holmes use to identify a criminal?" (GraphRAG wins via community reports).

**Question Classification:**
- Precomputed queries are pre-labeled.
- Live queries use a "Query Parser" step that uses the LLM to categorize the intent before retrieval starts.

## 4. Backend/API Design (Next.js Routes)
- `POST /api/query`: Receives query and mode (`standard`, `graph`, or `both`).
- `GET /api/trace/[id]`: Returns the full execution history for a specific query.

**Retrieval Trace Schema:**
```json
{
  "queryId": "uuid",
  "steps": [
    {
      "step": "entity_extraction",
      "status": "success",
      "data": { "entities": ["Irene Adler", "King of Bohemia"] },
      "insights": "Found 2 key entities; matching to Knowledge Graph..."
    }
  ]
}
```

## 5. Data Pipeline
- **Chunking:** Semantic chunking (merging small sentences until a token limit), or recursive character splitting with overlap.
- **Graph Extraction:** Using `gpt-4o-mini` to output JSON of `(Subject, Predicate, Object)` triplets.
- **Community Detection:** Using the **Leiden Algorithm** (via NetworkX/CDlib) to group nodes.
- **Summarization:** LLM generates a 100-word summary for each community cluster.
- **Caching:** All pre-indexed graph data and embeddings stored in local JSON/SQlite files for 0-latency demo.

## 6. Frontend Component Architecture
- **Root Layout:** `Header` + `QueryControlPanel` + `ComparisonGrid` + `Footer (Metrics)`.
- **Reusable Components:**
    - `TimelineCard`: Individual step logic (running/completed states).
    - `TracePayloadViewer`: The "Inspect" modal for raw data.
    - `MetricsBadge`: For Latency/Token displays.
- **State Management:** React `useState` for query state; `useEffect` to trigger sequential "step" reveals.

## 7. Implementation Sequence
1. **Data Engine:** Finalize Python script to output `final_corpus.json` (Chunks + Graph).
2. **UI Framework:** Set up Tailwind themes, fonts (Outfit/Inter), and Frame Motion layout.
3. **Trace Engine:** Create the "Replay" logic for precomputed queries.
4. **Step UI:** Build the animated `TimelineCard` components.
5. **Live Bridge:** Implement the actual LLM calls for custom queries.

## 8. Demo Mode
- A "Demo Mode" toggle in the UI (on by default).
- When ON: Queries click into the precomputed `exampleTraces.json`. The UI replaces the "Requesting API..." state with a "Replaying Saved Trace..." badge for honesty.
- When OFF: Real API calls are made, requiring an `.env` API key.

## 9. README / Portfolio Strategy
- **Video:** A 60-second "Pipeline Race" showing a Global question. GraphRAG's timeline finishes with a rich answer while Standard RAG's timeline shows "Irrelevant retrieval".
- **Diagrams:** A diagram comparing a "Vector Cloud" vs. a "Connected Node Network".
- **Technical Deep Dive:** A section explaining why "Community Summaries" solve the context-window bottleneck for global questions.

## 10. Final Folder Structure
```text
/
├── data/                  # Static Corpus + Precomputed Traces
├── scripts/               # Offline Python Indexing Pipeline
├── src/
│   ├── app/               # Root, Layout, Page
│   ├── components/        # Timeline, Evidence, GraphNodes
│   ├── lib/               # LLM Logic, RAG Utilities
│   └── styles/            # Thematic CSS
```
