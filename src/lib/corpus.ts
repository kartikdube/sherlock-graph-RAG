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
  title: string;
  summary: string;
  nodes: string[];
}

export const corpusData = {
  nodes: [
    { id: "n1", label: "Sherlock Holmes", type: "Person", description: "The world's first consulting detective." },
    { id: "n2", label: "Dr. Watson", type: "Person", description: "Holmes's companion and chronicler." },
    { id: "n3", label: "Irene Adler", type: "Person", description: "The woman who outwitted Holmes." },
    { id: "n4", label: "King of Bohemia", type: "Person", description: "The client in the scandal." },
    { id: "n5", label: "221B Baker St", type: "Location", description: "Resident of Sherlock Holmes." }
  ],
  edges: [
    { source: "n1", target: "n2", relation: "ACCOMPANIED_BY" },
    { source: "n1", target: "n3", relation: "ADMIRES" },
    { source: "n3", target: "n4", relation: "FORMERLY_LINKED_TO" },
    { source: "n1", target: "n5", relation: "LIVES_AT" }
  ],
  communities: [
    { 
      id: "comm_1", 
      title: "Bohemian Scandal Investigation", 
      summary: "This story explores the vulnerabilities of the nobility when faced with personal scandals. It highlights how Irene Adler's intelligence forces Holmes into a rare tactical defeat.",
      nodes: ["n1", "n3", "n4"]
    }
  ]
};
