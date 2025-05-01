import { useState } from "react";
import { JSONPOD } from "@pcd/pod";
import { verifyPodInternalSignature, checkPodSigner } from "./podVerification";
import { Buffer } from "buffer";
import { useMUD } from "../MUDContext";

// Make Buffer available globally
window.Buffer = Buffer;

const Unchecked = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 27 27"
    fill="none"
  >
    <rect
      x="0.5"
      y="0.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="0.5"
      y="4.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="0.5"
      y="8.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="0.5"
      y="12.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="0.5"
      y="16.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="0.5"
      y="20.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="0.5"
      y="24.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="4.5"
      y="0.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="4.5"
      y="4.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="4.5"
      y="8.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="4.5" y="12.5" width="2" height="2" stroke="#FF4700" />
    <rect
      x="4.5"
      y="20.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="4.5"
      y="16.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="4.5"
      y="24.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="8.5"
      y="0.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="8.5"
      y="4.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="8.5"
      y="8.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="8.5"
      y="20.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="8.5" y="12.5" width="2" height="2" stroke="#FF4700" />
    <rect
      x="8.5"
      y="16.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="8.5"
      y="24.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="12.5"
      y="0.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="12.5"
      y="4.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="12.5"
      y="20.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="12.5"
      y="8.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="12.5" y="12.5" width="2" height="2" stroke="#FF4700" />
    <rect
      x="12.5"
      y="16.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="12.5"
      y="24.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="16.5"
      y="0.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="20.5"
      y="0.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="24.5"
      y="0.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="16.5"
      y="4.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="20.5"
      y="4.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="24.5"
      y="4.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="16.5"
      y="8.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="20.5"
      y="8.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="24.5"
      y="8.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="16.5"
      y="20.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="16.5" y="12.5" width="2" height="2" stroke="#FF4700" />
    <rect x="20.5" y="12.5" width="2" height="2" stroke="#FF4700" />
    <rect
      x="20.5"
      y="20.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="24.5"
      y="20.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="24.5"
      y="12.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="16.5"
      y="16.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="16.5"
      y="24.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="20.5"
      y="16.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="24.5"
      y="16.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="20.5"
      y="24.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="24.5"
      y="24.5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
  </svg>
);
const Checked = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 28 28"
    fill="none"
  >
    <rect
      x="1.15625"
      y="1"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="1.15625"
      y="5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="1.15625"
      y="9"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="1.15625"
      y="13"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="1.15625"
      y="17"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="1.15625"
      y="21"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="1.15625"
      y="25"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="5.15625"
      y="1"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="5.15625"
      y="5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="5.15625"
      y="9"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="5.15625"
      y="13"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="5.15625"
      y="21"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="5.15625" y="17" width="2" height="2" stroke="#FF4700" />
    <rect
      x="5.15625"
      y="25"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="9.15625"
      y="1"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="9.15625"
      y="5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="9.15625"
      y="9"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="9.15625" y="21" width="2" height="2" stroke="#FF4700" />
    <rect
      x="9.15625"
      y="13"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="9.15625"
      y="17"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="9.15625"
      y="25"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="13.1562"
      y="1"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="13.1562"
      y="5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="13.1562"
      y="21"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="13.1562"
      y="9"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="13.1562"
      y="13"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="13.1562" y="17" width="2" height="2" stroke="#FF4700" />
    <rect
      x="13.1562"
      y="25"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="17.1562"
      y="1"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="21.1562"
      y="1"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="25.1562"
      y="1"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="17.1562"
      y="5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="21.1562"
      y="5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="25.1562"
      y="5"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="17.1562"
      y="9"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="21.1562" y="9" width="2" height="2" stroke="#FF4700" />
    <rect
      x="25.1562"
      y="9"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="17.1562"
      y="21"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect x="17.1562" y="13" width="2" height="2" stroke="#FF4700" />
    <rect
      x="21.1562"
      y="13"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="21.1562"
      y="21"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="25.1562"
      y="21"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="25.1562"
      y="13"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="17.1562"
      y="17"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="17.1562"
      y="25"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="21.1562"
      y="17"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="25.1562"
      y="17"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="21.1562"
      y="25"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
    <rect
      x="25.1562"
      y="25"
      width="2"
      height="2"
      stroke="#FF4700"
      strokeOpacity="0.3"
    />
  </svg>
);

const AUTHORITY_PUB_KEY = "GSDrthtjD/t5bSrLMMvnjeqJrtdjFxmhD0nfo/3fkpo";

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
    messages: { text: string; isValid: boolean }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyKillmailPod = (pod: JSONPOD) => {
    const messages: { text: string; isValid: boolean }[] = [];
    let isValid = true;

    // 1. Verify internal signature
    const hasValidSignature = verifyPodInternalSignature(pod);
    if (!hasValidSignature) {
      messages.push({
        text: "Pod internal signature verification failed",
        isValid: false,
      });
      isValid = false;
    } else {
      messages.push({ text: "Pod internal signature is valid", isValid: true });
    }

    // 2. Verify authority signature
    const isSignedByAuthority = checkPodSigner(pod, AUTHORITY_PUB_KEY);
    if (!isSignedByAuthority) {
      messages.push({
        text: "Pod is not signed by the expected authority",
        isValid: false,
      });
      isValid = false;
    } else {
      messages.push({
        text: "Pod is signed by the correct authority",
        isValid: true,
      });
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
        messages.push({
          text: `Missing required field: ${field}`,
          isValid: false,
        });
        isValid = false;
      }
    }

    // 4. Verify pod type
    if (pod.entries.pod_data_type !== "evefrontier.killmail") {
      messages.push({
        text: 'Invalid pod type: expected "evefrontier.killmail"',
        isValid: false,
      });
      isValid = false;
    } else {
      messages.push({ text: "Pod type is correct", isValid: true });
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
          backgroundColor: "#111",
          borderColor: "#db6329",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "8px",
          color: "#db6329",
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
            borderColor: "#db6329",
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: "8px",
            color: "#db6329",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Verification Results:</h3>
          {verificationResult.messages.map((msg, index) => (
            <div
              key={index}
              style={{
                color: "#db6329",
                marginBottom: "0.5rem",
                alignItems: "center",
                display: "flex",
                gap: "0.5rem",
                fontSize: "14px",
              }}
            >
              {msg.isValid ? <Checked /> : <Unchecked />} {msg.text}
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
