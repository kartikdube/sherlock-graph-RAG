# 🕵️‍♂️ Sherlock GraphRAG vs. Vector RAG

A high-fidelity visual exploration platform for comparing **Semantic Vector Retrieval** and **Graph-Based Community Retrieval** using "The Adventures of Sherlock Holmes" as the corpus.

![Architecture Diagram Placeholder](https://via.placeholder.com/800x400.png?text=GraphRAG+Architecture+Visual)

## 🚀 The Concept
Standard RAG (Retrieval-Augmented Generation) often fails on **global questions** (e.g., "What are the themes?") because it only retrieves disconnected pieces of text. 

**GraphRAG** solves this by:
1. Extracting a Knowledge Graph of Entities (Characters, Places) and Relationships.
2. Clustering these entities into **Communities** using the Leiden algorithm.
3. Summarizing these communities to create a hierarchical map of the entire text.

## 🛠️ Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Next.js Serverless API (Engine Layer).
- **Indexing:** Python (NetworkX + Leiden Community Detection).
- **LLM:** OpenAI GPT-4o-mini (for extraction and synthesis).

## 🧩 Key Features
- **Parallel Pipeline Visualizer:** Watch both retrieval processes execute side-by-side.
- **Artifact Inspector:** Click any retrieval step to see the raw data (Chunks, Triplets, or Community Reports).
- **Demo Mode:** Instant replay of 6 gold-standard queries to showcase performance differences immediately.
- **Question Classification:** Automatic detection of Local vs. Global query intent.

## 📖 Demo Questions
| Question Type | Standard RAG | GraphRAG | Winner |
| :--- | :--- | :--- | :--- |
| **Local** | Finds exact sentence about a color/name. | Often over-retrieves wide context. | 🟢 Vector |
| **Global** | Retrieves random keywords; misses the big picture. | Pulls high-level community summaries. | 🟡 Graph |
| **Multi-hop** | Struggles to connect distant concepts. | Follows graph edges to link entities. | 🟡 Graph |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+ (for indexing scripts)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sherlock-graph-rag.git
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Preprocessing (Optional)
To index your own Sherlock Holmes stories:
1. Install Python dependencies:
   ```bash
   pip install networkx cdlib openai
   ```
2. Run the extraction script:
   ```bash
   python scripts/extract_graph.py --input data/story.txt
   ```

---

## 📈 Why GraphRAG?
In a standard RAG system, the answer to "What recurring patterns appear?" doesn't exist in any single chunk. Standard retrieval is forced to pull 10 disjointed chunks, hoping the LLM can synthesize them.

In **GraphRAG**, the offline indexing process already clustered behaviors and generated a **Community Report**. When the global query is asked, GraphRAG retrieves the report, yielding a deeply synthesized and accurate answer.

---

*Developed by Antigravity - Optimized for Portfolio Impact.*
