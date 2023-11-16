/**
 * Tests if the app is running in an <iframe>
 */
export const isIFrame = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};