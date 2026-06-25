"use client";

import { useEffect } from "react";

/**
 * Top-most error boundary. Only fires if the root layout itself
 * throws. Must render its own `<html>` + `<body>` because the layout
 * never executed.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body
        style={{
          minHeight: "100dvh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0a0a0a",
          color: "#e5e5e5",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>App crashed</h1>
          <p style={{ color: "#9ca3af", marginTop: 8 }}>
            A fatal error prevented the app from rendering. Refresh the page to
            recover.
          </p>
          {error.digest && (
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "#6b7280",
                marginTop: 12,
              }}
            >
              digest: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              background: "#516af6",
              color: "#f7f7f7",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
