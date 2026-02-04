export type HistoryEntry = {
  id: string;
  tool: string;
  inputSummary: string;
  outputSummary: string;
  outputUrl?: string;
  createdAt: number;
};
