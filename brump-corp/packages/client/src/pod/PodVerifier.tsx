import { useState } from "react";
import { JSONPOD } from "@pcd/pod";
import { verifyPodInternalSignature, checkPodSigner } from "./podVerification";
import { Buffer } from "buffer";

// Make Buffer available globally
window.Buffer = Buffer;

const AUTHORITY_PUB_KEY = "Mc2IbgO1ihBqpoPgE4WacZcORWNfNJko5v9rg4o2AiM";

interface PodVerifierProps {
  onValidPod: () => Promise<void>;
}

export function PodVerifier({ onValidPod }: PodVerifierProps) {
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
      'killer_address',
      'killer_name',
      'loss_type',
      'pod_data_type',
      'solar_system_id',
      'timestamp',
      'victim_address',
      'victim_name'
    ];

    for (const field of requiredFields) {
      if (!(field in pod.entries)) {
        messages.push(`❌ Missing required field: ${field}`);
        isValid = false;
      }
    }

    // 4. Verify pod type
    if (pod.entries.pod_data_type !== 'evefrontier.killmail') {
      messages.push('❌ Invalid pod type: expected "evefrontier.killmail"');
      isValid = false;
    } else {
      messages.push('✅ Pod type is correct');
    }

    return { isValid, messages };
  };

  const handleVerify = async () => {
    try {
      setError(null);
      const parsedPod = JSON.parse(podInput) as JSONPOD;
      const result = verifyKillmailPod(parsedPod);
      setVerificationResult(result);
      
      if (result.isValid) {
        await onValidPod();
      }
    } catch (e) {
      setError("Invalid JSON format. Please check your input.");
      setVerificationResult(null);
    }
  };

  return (
    <div className="pod-verifier">
      <h2>Killmail POD Verifier</h2>
      <textarea
        value={podInput}
        onChange={(e) => setPodInput(e.target.value)}
        placeholder="Paste your JSONPOD here..."
        style={{ width: "100%", height: "200px", marginBottom: "1rem" }}
      />
      <button onClick={handleVerify}>Verify POD</button>
      
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      
      {verificationResult && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Verification Results:</h3>
          {verificationResult.messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
          <div style={{ 
            marginTop: "1rem", 
            fontWeight: "bold",
            color: verificationResult.isValid ? "green" : "red"
          }}>
            Final Result: {verificationResult.isValid ? "✅ VALID" : "❌ INVALID"}
          </div>
        </div>
      )}
    </div>
  );
} 