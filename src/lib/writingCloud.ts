// AI terminology word cloud for the Writing hero. Weights (1-5) derive from
// term frequencies extracted from the actual blog posts (Firecrawl analysis of
// six representative articles, Sep 2026): ONNX/ONNX Script posts, "Why do
// companies Open Source Software?", the Lemonade Python/Tiny Agents AMD
// articles, and the gpt-oss launch post. Re-run the analysis when the corpus
// shifts; this is data, not decoration.
export const cloud: { t: string; w: 1 | 2 | 3 | 4 | 5 }[] = [
  { t: "ONNX", w: 5 },
  { t: "open source", w: 5 },
  { t: "LLMs", w: 5 },
  { t: "local AI", w: 5 },
  { t: "Python", w: 4 },
  { t: "inference", w: 4 },
  { t: "Lemonade", w: 4 },
  { t: "models", w: 4 },
  { t: "NPU", w: 3 },
  { t: "MCP", w: 3 },
  { t: "agents", w: 3 },
  { t: "frameworks", w: 3 },
  { t: "operators", w: 3 },
  { t: "PyTorch", w: 3 },
  { t: "Ryzen AI", w: 3 },
  { t: "Hugging Face", w: 3 },
  { t: "ecosystem", w: 3 },
  { t: "GPU", w: 3 },
  { t: "OpenAI-compatible", w: 3 },
  { t: "llama.cpp", w: 2 },
  { t: "quantization", w: 2 },
  { t: "runtimes", w: 2 },
  { t: "compilers", w: 2 },
  { t: "GGUF", w: 2 },
  { t: "gpt-oss", w: 2 },
  { t: "TensorFlow", w: 2 },
  { t: "graphs", w: 2 },
  { t: "tensors", w: 2 },
  { t: "ROCm", w: 2 },
  { t: "eager mode", w: 2 },
  { t: "training", w: 2 },
  { t: "portability", w: 1 },
  { t: "Vulkan", w: 1 },
  { t: "FastFlowLM", w: 1 },
  { t: "interoperability", w: 1 },
];
