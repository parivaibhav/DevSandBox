import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const examples = {
  "Hello World": {
    html: `<h1>Hello, Code Runner!</h1>\n<button onclick="greet()">Click Me</button>`,
    css: `body { font-family: sans-serif; text-align: center; padding: 2rem; }\nh1 { color: royalblue; }\nbutton { padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 0.25rem; cursor: pointer; }`,
    js: `function greet() { alert("Welcome to the live code runner!"); console.warn('Be careful!'); console.error('Something went wrong'); }`
  },
  "JS Clock": {
    html: `<h1 id="clock"></h1>`,
    css: `h1 { font-size: 3rem; text-align: center; margin-top: 20vh; }`,
    js: `setInterval(() => { document.getElementById('clock').textContent = new Date().toLocaleTimeString(); console.log("Tick..."); }, 1000);`
  }
};

export const useEditorStore = create(persist(
  (set, get) => ({
    token: '',
    theme: 'light',
    menuOpen: false,
    selectedExample: 'Hello World',
    consoleLogs: [],
    srcDoc: '',
    code: {
      html: examples["Hello World"].html,
      css: examples["Hello World"].css,
      js: examples["Hello World"].js,
      filename: 'my-code',
      includeJQuery: false,
      includeBootstrap: false
    },

    // Actions
    setToken: (token) => set({ token }),
    setTheme: (theme) => set({ theme }),
    toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),

    setSelectedExample: (name) => {
      const ex = examples[name];
      set({
        selectedExample: name,
        code: {
          html: ex.html,
          css: ex.css,
          js: ex.js,
          filename: 'my-code',
          includeJQuery: false,
          includeBootstrap: false
        }
      });
    },

    setConsoleLogs: (logs) => set({ consoleLogs: logs }),
    addConsoleLog: (log) => set((state) => ({ consoleLogs: [...state.consoleLogs, log] })),
    setSrcDoc: (doc) => set({ srcDoc: doc }),

    setCode: (update) => {
      set((state) => ({
        code: typeof update === 'function'
          ? update(state.code)
          : { ...state.code, ...update }
      }));
    },

    resetEditor: () => set({
      selectedExample: 'Hello World',
      consoleLogs: [],
      srcDoc: '',
      code: {
        html: examples["Hello World"].html,
        css: examples["Hello World"].css,
        js: examples["Hello World"].js,
        filename: 'my-code',
        includeJQuery: false,
        includeBootstrap: false
      }
    }),
  }),
  {
    name: 'editor-storage', // localStorage key
    partialize: (state) => ({
      theme: state.theme,
      code: state.code,
      selectedExample: state.selectedExample,
      token: state.token
    })
  }
));
