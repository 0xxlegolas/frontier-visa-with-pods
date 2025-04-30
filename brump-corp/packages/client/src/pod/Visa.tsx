import { useEffect, useState } from "react";
import { JSONPOD } from "@pcd/pod";
import { verifyPodInternalSignature, checkPodSigner } from "./podVerification";
import { Buffer } from "buffer";
import { useMUD } from "../MUDContext";
import { createVisaPod } from "./createVisaPod";

// Make Buffer available globally
window.Buffer = Buffer;

const AUTHORITY_PUB_KEY = "Mc2IbgO1ihBqpoPgE4WacZcORWNfNJko5v9rg4o2AiM";

interface VisaProps {
  playerAddress: (player: string) => Promise<void>;
  statusInfo: {
    image: string;
    text: string;
    color: string;
    description: string;
  };
  counterValue: number;
  holderAddress: string;
}


export function Visa({ playerAddress, statusInfo, counterValue, holderAddress }: VisaProps) {
  const [visaPod, setVisaPod] = useState();

  
  return playerAddress ? (
    <div>
      <h2>Your Status</h2>
      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div style={{ width: "64px", height: "64px" }}>
          <img
            src={statusInfo.image}
            alt={statusInfo.text}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, color: statusInfo.color }}>{statusInfo.text}</h3>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            {statusInfo.description}
          </p>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Killmail Count: {counterValue}
          </p>
        </div>
        <button
          onClick={async () => {
            try {
              const pod = await createVisaPod(holderAddress, new Date("2026-04-10T00:00:00.000Z"), 6);
              setVisaPod(pod);
            } catch (err) {
              console.error("Failed to create POD:", err);
            }
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ff5722",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Generate POD
        </button>
      </div>
      <div>
     { visaPod && <pre
          style={{
            backgroundColor: "#111",
            color: "#0f0",
            padding: "1rem",
            borderRadius: "8px",
            overflowX: "auto",
            fontSize: "0.85rem",
          }}
        >
  {visaPod ? JSON.stringify(JSON.parse(visaPod), null, 2) : "No POD"}
  </pre>}
      </div>
    </div>
  ) : (
    <div >
      <h2>Welcome to Frontier Visa</h2>
      <p style={{ color: "#666", marginBottom: "1rem" }}>
        Submit your killmail POD to get started and earn your visa status.
      </p>
    </div>  
  );
  
} 