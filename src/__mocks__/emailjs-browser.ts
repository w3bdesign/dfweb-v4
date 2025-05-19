/**
 * Mock for @emailjs/browser module to use in Ladle stories
 */

// Mock send function that returns a Promise that resolves to "OK"
export const send = async (): Promise<string> => {
  return Promise.resolve("OK");
};

// Mock init function
export const init = (apiKey?: string): void => {
  console.log(`EmailJS initialized with key: ${apiKey || 'mock-key'}`);
};

export default {
  send,
  init,
};
