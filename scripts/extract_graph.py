import json
import os
import uuid

# MOCK PREPROCESS SCRIPT for Sherlock GraphRAG vs RAG
# This script illustrates the index pipeline for the MVP.
# In a real context, you would use LangChain/LlamaIndex or custom LLM bindings 
# to parse actual text, run community detection via NetworkX, and embed via unpickled models.

CORPUS_TEXT = [
    "Sherlock Holmes sat in his armchair, observing the blue hat that had been left behind. The hat belonged to Mr. Henry Baker.",
    "Watson noted that Holmes often relied on seemingly insignificant details, a theme across many of their cases involving stolen items."
]

def generate_chunks():
    chunks = []
    for i, text in enumerate(CORPUS_TEXT):
        chunks.append({
            "id": f"chunk-{i+1}",
            "text": text,
            "source": "A Scandal in Bohemia",
            "embedding": [0.1, 0.2, 0.3, i*0.1] # Dummy embeddings
        })
    return chunks

def generate_graph():
    nodes = [
        {"id": "Sherlock Holmes", "label": "Sherlock Holmes", "type": "Person", "description": "Consulting Detective"},
        {"id": "Watson", "label": "John Watson", "type": "Person", "description": "Doctor and Holmes' friend"},
        {"id": "Blue Hat", "label": "Blue Hat", "type": "Object", "description": "A clue left behind"},
        {"id": "Henry Baker", "label": "Henry Baker", "type": "Person", "description": "Owner of the blue hat"}
    ]
    edges = [
        {"source": "Sherlock Holmes", "target": "Blue Hat", "relation": "OBSERVED", "evidenceChunkIds": ["chunk-1"]},
        {"source": "Blue Hat", "target": "Henry Baker", "relation": "BELONGS_TO", "evidenceChunkIds": ["chunk-1"]},
        {"source": "Watson", "target": "Sherlock Holmes", "relation": "OBSERVED_BEHAVIOR", "evidenceChunkIds": ["chunk-2"]}
    ]
    communities = [
        {
            "id": "community-1",
            "level": 1,
            "title": "The Mystery of the Blue Hat",
            "summary": "Sherlock Holmes and John Watson are investigating a seemingly mundane blue hat that belongs to Mr. Henry Baker. Watson observes that Holmes uses these small clues to deduce larger themes of stolen items.",
            "memberNodeIds": ["Sherlock Holmes", "Watson", "Blue Hat", "Henry Baker"]
        }
    ]
    return {"nodes": nodes, "edges": edges, "communities": communities}


if __name__ == "__main__":
    os.makedirs("src/data", exist_ok=True)
    with open("src/data/mockCorpus.json", "w") as f:
        json.dump({"chunks": generate_chunks(), "graph": generate_graph()}, f, indent=2)
    print("Pre-processed corpus generated for MVP UI.")
