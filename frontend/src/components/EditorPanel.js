import Editor from '@monaco-editor/react';
import { VscRunAll } from "react-icons/vsc";
import { IoIosSave } from "react-icons/io";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { useTheme } from '../contexts/ThemeContext'; // ✅ adjust the path to your context file

export default function EditorPanel({
  html, css, js, setHtml, setCss, setJs,
  filename, setFilename,
  includeJQuery, setIncludeJQuery,
  includeBootstrap, setIncludeBootstrap,
  runCode, saveFile, downloadZip
}) {
  const { theme } = useTheme(); // ✅ Get theme from context
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light'; // Convert to Monaco-compatible theme

  return (
    <div className="space-y-6">
      {/* Filename input + checkboxes */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filename input */}
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Name to save into zip"
          className="border px-3 py-2 rounded text-sm w-full sm:w-auto
            text-black dark:text-white
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-700"
        />

        {/* jQuery & Bootstrap checkboxes */}
        <div className="flex gap-3 flex-wrap">
          {/* jQuery */}
          <label className="flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all text-sm font-medium
            border-blue-500 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800 dark:text-blue-300
            bg-white dark:bg-gray-900">
            <input
              type="checkbox"
              checked={includeJQuery}
              onChange={(e) => setIncludeJQuery(e.target.checked)}
              className="accent-blue-500"
            />
            jQuery
          </label>

          {/* Bootstrap */}
          <label className="flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all text-sm font-medium
            border-indigo-500 text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-800 dark:text-indigo-300
            bg-white dark:bg-gray-900">
            <input
              type="checkbox"
              checked={includeBootstrap}
              onChange={(e) => setIncludeBootstrap(e.target.checked)}
              className="accent-indigo-500"
            />
            Bootstrap
          </label>
        </div>
      </div>

      {/* Code Editors */}
      {['HTML', 'CSS', 'JavaScript'].map((lang, i) => (
        <div key={lang} className="rounded-lg shadow border overflow-hidden
          border-gray-200 dark:border-gray-700">
          <div className="px-3 py-2 font-medium text-sm
            bg-gray-100 dark:bg-gray-800
            text-gray-700 dark:text-gray-200">
            {lang}
          </div>
          <Editor
            key={monacoTheme} // force refresh theme
            height="150px"
            defaultLanguage={lang.toLowerCase()}
            theme={monacoTheme}
            value={i === 0 ? html : i === 1 ? css : js}
            onChange={(v) => {
              if (v === null) return;
              if (i === 0) setHtml(v);
              else if (i === 1) setCss(v);
              else setJs(v);
            }}
            options={{ fontSize: 14 }}
          />
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={runCode}
          className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded shadow text-2xl"
        >
          <VscRunAll />
        </button>
        <button
          onClick={saveFile}
          className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded shadow text-2xl"
        >
          <IoIosSave />
        </button>
        <button
          onClick={downloadZip}
          className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded shadow text-2xl"
        >
          <HiOutlineFolderDownload />
        </button>
      </div>
    </div>
  );
}
