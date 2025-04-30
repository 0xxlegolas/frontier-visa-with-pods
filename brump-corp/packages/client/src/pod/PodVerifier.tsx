import { useState } from "react";
import { JSONPOD } from "@pcd/pod";
import { verifyPodInternalSignature, checkPodSigner } from "./podVerification";
import { Buffer } from "buffer";
import { useMUD } from "../MUDContext";

// Make Buffer available globally
window.Buffer = Buffer;

const AUTHORITY_PUB_KEY = "Mc2IbgO1ihBqpoPgE4WacZcORWNfNJko5v9rg4o2AiM";

interface PodVerifierProps {
  onValidPod: (player: string) => Promise<void>;
  setHolderAddress: (address: string) => void;
}

export function PodVerifier({
  onValidPod,
  setHolderAddress,
}: PodVerifierProps) {
  const {
    systemCalls: { submitKillmail },
  } = useMUD();

  const [podInput, setPodInput] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    messages: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyKillmailPod = (pod: JSONPOD) => {
    const messages: string[] = [];
    let isValid = true;

    // 1. Verify internal signature
    const hasValidSignature = verifyPodInternalSignature(pod);
    if (!hasValidSignature) {
      messages.push("❌ Pod internal signature verification failed");
      isValid = false;
    } else {
      messages.push("✅ Pod internal signature is valid");
    }

    // 2. Verify authority signature
    const isSignedByAuthority = checkPodSigner(pod, AUTHORITY_PUB_KEY);
    if (!isSignedByAuthority) {
      messages.push("❌ Pod is not signed by the expected authority");
      isValid = false;
    } else {
      messages.push("✅ Pod is signed by the correct authority");
    }

    // 3. Verify required fields
    const requiredFields = [
      "killer_address",
      "killer_name",
      "loss_type",
      "pod_data_type",
      "solar_system_id",
      "timestamp",
      "victim_address",
      "victim_name",
    ];

    for (const field of requiredFields) {
      if (!(field in pod.entries)) {
        messages.push(`❌ Missing required field: ${field}`);
        isValid = false;
      }
    }

    // 4. Verify pod type
    if (pod.entries.pod_data_type !== "evefrontier.killmail") {
      messages.push('❌ Invalid pod type: expected "evefrontier.killmail"');
      isValid = false;
    } else {
      messages.push("✅ Pod type is correct");
    }

    return { isValid, messages };
  };

  const handleVerify = async () => {
    try {
      setError(null);
      setVerificationResult(null);

      // Trim and clean the input
      const cleanedInput = podInput.trim();
      if (!cleanedInput) {
        setError("Please enter a POD");
        return;
      }

      // Try to parse the JSON
      let parsedPod: JSONPOD;
      try {
        parsedPod = JSON.parse(cleanedInput);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        setError("Invalid JSON format. Please check your input.");
        return;
      }

      // Verify the POD structure
      const result = verifyKillmailPod(parsedPod);
      setVerificationResult(result);

      if (result.isValid) {
        try {
          const killerAddress = parsedPod.entries.killer_address;
          setHolderAddress(killerAddress as string);
          if (!killerAddress) {
            setError("Killer address not found in POD");
            return;
          }
          await onValidPod(killerAddress as string);
        } catch (podError) {
          console.error("POD Processing Error:", podError);
          setError("Error processing POD. Please try again.");
        }
      }
    } catch (e) {
      console.error("Unexpected Error:", e);
      setError("An unexpected error occurred. Please try again.");
      setVerificationResult(null);
    }
  };

  return (
    <div className="pod-verifier">
      <textarea
        value={podInput}
        onChange={(e) => setPodInput(e.target.value)}
        placeholder="Paste your JSONPOD here..."
        style={{
          width: "100%",
          height: "200px",
          marginBottom: "1rem",
          padding: "0.5rem",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      />
      <button
        onClick={handleVerify}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#ff4700",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Verify POD
      </button>

      {error && (
        <div
          style={{
            color: "red",
            marginTop: "1rem",
            padding: "0.5rem",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
      {verificationResult && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Verification Results:</h3>
          {verificationResult.messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              {msg}
            </div>
          ))}
          <div
            style={{
              marginTop: "1rem",
              fontWeight: "bold",
              color: verificationResult.isValid ? "green" : "red",
            }}
          >
            Final Result:{" "}
            {verificationResult.isValid ? "✅ VALID" : "❌ INVALID"}
          </div>
        </div>
      )}
    </div>
  );
}
