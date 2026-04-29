import { useCallback, useRef, useState } from "react";
import { useWebOTP } from "./useWebOtp";

function App() {
  const [code, setCode] = useState("xxxxx");
  const [logs, setLogs] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const log = useCallback((msg: string) => {
    setLogs((prev) => {
      const next = [...prev, msg];
      // scroll to bottom after render
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }, 0);
      return next;
    });
  }, []);

  useWebOTP((aaa) => {
    console.group("notify");
    console.log(aaa);
    console.groupEnd();
    log("Received OTP: " + aaa);
    setCode(aaa);
  }, log);

  return (
    <div style={{ padding: 16, fontFamily: "monospace", maxWidth: 600 }}>
      <input
        type="text"
        autoComplete="one-time-code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ fontSize: 24, width: "100%", marginBottom: 16 }}
      />
      <textarea
        ref={textareaRef}
        readOnly
        value={logs.join("\n")}
        style={{
          width: "100%",
          height: 400,
          fontSize: 12,
          background: "#111",
          color: "#0f0",
          border: "1px solid #333",
          padding: 8,
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />
      <button
        onClick={() => setLogs([])}
        style={{ marginTop: 8, padding: "4px 12px" }}
      >
        Clear logs
      </button>
    </div>
  );
}

export default App;
