import axios from 'axios';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useEffect, useRef } from 'react';
import { FaTerminal } from 'react-icons/fa';
import { HiOutlineBars2 } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { PiMoonStarsFill } from "react-icons/pi";
import { TbSunFilled } from "react-icons/tb";
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import EditorPanel from './components/EditorPanel';
import FileExplorer from './components/FileExplorer';
import Footer from './components/Footer';
import GoogleLoginButton from './components/GoogleLoginButton';
import PreviewFrame from './components/PreviewFrame';
import { useEditorStore } from './stores/useEditorStore';
import { useTheme } from './contexts/ThemeContext';

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

export default function App() {
  const { filename: routeFilename } = useParams();
  const fileExplorerRef = useRef();
  const { theme, toggleTheme } = useTheme();
  const {
    token, setToken,
    menuOpen, toggleMenu,
    selectedExample, setSelectedExample,
    consoleLogs, setConsoleLogs, addConsoleLog,
    srcDoc, setSrcDoc,
    code, setCode
  } = useEditorStore();

  useEffect(() => {
    const listener = ({ data }) => {
      if (["log", "warn", "error"].includes(data.type)) addConsoleLog(data);
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  useEffect(() => {
    if (routeFilename) setCode({ filename: routeFilename });
  }, [routeFilename]);

  const resetEditor = () => {
    setCode({ ...examples["Hello World"], filename: "my-code", includeJQuery: false, includeBootstrap: false });
    setSelectedExample("Hello World");
    setSrcDoc('');
    setConsoleLogs([]);
  };

  const runCode = () => {
    setConsoleLogs([]);
    const { html, css, js, includeJQuery, includeBootstrap } = code;
    const libs = `
      ${includeJQuery ? `<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>` : ''}
      ${includeBootstrap ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>` : ''}
    `;
    const injectedConsole = `
      <script>
        const sendMessage = (type, args) => parent.postMessage({ type, args }, '*');
        ['log', 'warn', 'error'].forEach(type => {
          const orig = console[type];
          console[type] = (...args) => { sendMessage(type, args); orig.apply(console, args); };
        });
      </script>
    `;
    setSrcDoc(`<!DOCTYPE html><html><head>${libs}<style>${css}</style></head><body>${html}${injectedConsole}<script>${js}</script></body></html>`);
  };

  const previewInNewTab = () => {
    const { html, css, js, includeJQuery, includeBootstrap } = code;
    const libs = `
      ${includeJQuery ? `<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>` : ''}
      ${includeBootstrap ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>` : ''}
    `;
    const fullCode = `<!DOCTYPE html><html><head>${libs}<style>${css}</style></head><body>${html}<script>${js}</script></body></html>`;
    const blob = new Blob([fullCode], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  const downloadZip = () => {
    if (!token) return toast.error("Please log in to download your project.");
    const { html, css, js, includeJQuery, includeBootstrap, filename } = code;
    const zip = new JSZip();
    const libs = includeJQuery ? `<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>` : '';
    const bootstrap = includeBootstrap ? `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">` : '';

    const indexHTML = `<!DOCTYPE html><html><head>${libs}${bootstrap}<link rel="stylesheet" href="style.css"></head><body>${html}<script src="script.js"></script></body></html>`;

    zip.file("index.html", indexHTML);
    zip.file("style.css", css);
    zip.file("script.js", js);

    zip.generateAsync({ type: "blob" }).then(blob => {
      saveAs(blob, `${filename}.zip`);
      toast.success("Project downloaded!");
    });
  };

  const saveFile = async () => {
    if (!token) return toast.error("Login required to save files.");
    try {
      const { filename, html, css, js } = code;
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/files/check-name`, { name: filename }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.exists) return toast.warning("This filename already exists. Please choose a different name.");

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/files/save`, { html, css, js, name: filename }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("File saved successfully!");
      fileExplorerRef.current?.refresh();
    } catch (err) {
      toast.error("Failed to save file.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <header className={`w-full border-b px-4 py-3 shadow-sm ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-black border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={toggleMenu} className="sm:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              {menuOpen ? <IoCloseOutline size={20} /> : <HiOutlineBars2 size={20} />}
            </button>
            <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <FaTerminal className="w-5 h-5" /> <span>DevSandBox</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'dark' ? <TbSunFilled className="w-5 h-5 text-yellow-400" /> : <PiMoonStarsFill className="w-5 h-5 text-gray-800" />}
            </button>
            <select value={selectedExample} onChange={(e) => {
              const ex = e.target.value;
              setSelectedExample(ex);
              setCode(prev => ({ ...prev, ...examples[ex] }));
              setSrcDoc('');
            }} className="px-2 py-1 rounded-md text-sm border dark:border-gray-600 bg-white text-black dark:bg-gray-800 dark:text-white">
              {Object.keys(examples).map(key => <option key={key}>{key}</option>)}
            </select>
            <button onClick={resetEditor} className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white">Reset</button>
            {!token ? <GoogleLoginButton setToken={setToken} /> : <button onClick={() => { localStorage.removeItem('token'); setToken(''); }} className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md">Logout</button>}
          </div>
          <div className="sm:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'dark' ? <TbSunFilled className="w-5 h-5 text-yellow-400" /> : <PiMoonStarsFill className="w-5 h-5 text-gray-800" />}
            </button>
          </div>
        </div>
        {menuOpen && token && (
          <div className="sm:hidden mt-3 space-y-3">
            <select value={selectedExample} onChange={(e) => {
              const ex = e.target.value;
              setSelectedExample(ex);
              setCode(prev => ({ ...prev, ...examples[ex] }));
              setSrcDoc('');
            }} className="w-full px-2 py-1 rounded-md text-sm border dark:border-gray-600 bg-white text-black dark:bg-gray-800 dark:text-white">
              {Object.keys(examples).map(key => <option key={key}>{key}</option>)}
            </select>
            <button onClick={resetEditor} className="w-full text-sm px-3 py-1 rounded-md bg-blue-600 text-white">Reset</button>
            <button onClick={() => { localStorage.removeItem('token'); setToken(''); }} className="w-full bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md">Logout</button>
            <div className="max-h-60 overflow-y-auto border-t pt-2 mt-2 dark:border-gray-700">
              <FileExplorer token={token} onLoadFile={setCode} ref={fileExplorerRef} />
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {token && <div className="hidden sm:block w-64 border-r bg-white dark:bg-gray-800 dark:border-gray-700 overflow-y-auto">
          <FileExplorer token={token} onLoadFile={setCode} ref={fileExplorerRef} />
        </div>}

        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditorPanel
              {...code}
              setHtml={html => setCode(prev => ({ ...prev, html }))}
              setCss={css => setCode(prev => ({ ...prev, css }))}
              setJs={js => setCode(prev => ({ ...prev, js }))}
              setFilename={filename => setCode(prev => ({ ...prev, filename }))}
              setIncludeJQuery={val => setCode(prev => ({ ...prev, includeJQuery: val }))}
              setIncludeBootstrap={val => setCode(prev => ({ ...prev, includeBootstrap: val }))}
              includeJQuery={code.includeJQuery}
              includeBootstrap={code.includeBootstrap}
              theme={theme}
              runCode={runCode}
              saveFile={saveFile}
              downloadZip={downloadZip}
            />
            <div>
              <PreviewFrame srcDoc={srcDoc} previewInNewTab={previewInNewTab} />
              <div className="bg-black text-white rounded-lg p-3 mt-4 max-h-60 overflow-y-auto font-mono text-sm">
                <div className="flex justify-between mb-2">
                  <strong>Console</strong>
                  <button onClick={() => setConsoleLogs([])} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Clear</button>
                </div>
                {consoleLogs.length === 0 ? (
                  <div className="text-gray-400">No output</div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div key={idx} className={log.type === 'log' ? 'text-gray-200' : log.type === 'warn' ? 'text-yellow-400' : 'text-red-400'}>
                      {log.args.map((arg, i) => <span key={i}>{JSON.stringify(arg)} </span>)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
