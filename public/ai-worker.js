// Gemma 4 E2B on-device inference worker
// Runs in a Web Worker to keep UI responsive

let pipeline = null;
let generator = null;
let isLoading = false;

const MODEL_ID = "onnx-community/gemma-4-E2B-it-ONNX";

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type === "load") {
    if (isLoading || generator) return;
    isLoading = true;

    try {
      self.postMessage({ type: "status", status: "downloading" });

      // Dynamic import of transformers.js
      const { pipeline: createPipeline, env } = await import(
        "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3"
      );

      // Use WebGPU if available, fall back to WASM
      env.backends.onnx.wasm.proxy = true;

      self.postMessage({ type: "status", status: "loading" });

      generator = await createPipeline("text-generation", MODEL_ID, {
        dtype: "q4f16",
        device: "webgpu",
        progress_callback: (progress) => {
          if (progress.status === "progress" && progress.total) {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            self.postMessage({ type: "progress", percent: pct, file: progress.file });
          }
        },
      });

      self.postMessage({ type: "status", status: "ready" });
    } catch (err) {
      // Try WASM fallback if WebGPU fails
      try {
        self.postMessage({ type: "status", status: "loading", note: "Using CPU (WebGPU unavailable)" });

        const { pipeline: createPipeline } = await import(
          "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3"
        );

        generator = await createPipeline("text-generation", MODEL_ID, {
          dtype: "q4",
          device: "wasm",
          progress_callback: (progress) => {
            if (progress.status === "progress" && progress.total) {
              const pct = Math.round((progress.loaded / progress.total) * 100);
              self.postMessage({ type: "progress", percent: pct, file: progress.file });
            }
          },
        });

        self.postMessage({ type: "status", status: "ready" });
      } catch (fallbackErr) {
        self.postMessage({
          type: "error",
          error: "Your browser doesn't support on-device AI. Try Chrome on Android or Safari 18+ on iOS.",
        });
      }
    } finally {
      isLoading = false;
    }
  }

  if (type === "generate") {
    if (!generator) {
      self.postMessage({ type: "error", error: "Model not loaded yet" });
      return;
    }

    const { messages, systemPrompt } = payload;

    try {
      self.postMessage({ type: "status", status: "thinking" });

      const chat = [
        { role: "user", content: systemPrompt + "\n\nUser: " + messages[messages.length - 1].content },
      ];

      // If there's history, build proper chat
      if (messages.length > 1) {
        chat.length = 0;
        chat.push({ role: "user", content: systemPrompt + "\n\nRespond as Festie." });
        chat.push({ role: "assistant", content: "YOOO I'm ready!! What do you wanna know?? 🛸" });
        for (const msg of messages) {
          chat.push({ role: msg.role === "festie" ? "assistant" : "user", content: msg.content });
        }
      }

      const result = await generator(chat, {
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      });

      // Extract the assistant's response
      const output = result[0].generated_text;
      let response;
      if (Array.isArray(output)) {
        // Chat format — last message is the assistant response
        response = output[output.length - 1].content;
      } else {
        // Plain text — extract after the last user message
        response = output;
      }

      self.postMessage({ type: "response", text: response });
    } catch (err) {
      self.postMessage({ type: "error", error: "Generation failed: " + err.message });
    }
  }
};
