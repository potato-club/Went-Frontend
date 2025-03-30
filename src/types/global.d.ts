export {}; // 이거 꼭 있어야 global scope로 인식됨

declare global {
  interface Window {
    google: any;
  }
}
