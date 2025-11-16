export async function askAIStream(inputText) {
  // Simulated streaming (replace with real API later)
  const fakeResponse = "Hello, I am Mene Bot — I can help you with anything!";
  const chunks = fakeResponse.split(" ");

  async function* stream() {
    for (const chunk of chunks) {
      await new Promise((r) => setTimeout(r, 150));
      yield chunk + " ";
    }
  }

  return stream();
}
