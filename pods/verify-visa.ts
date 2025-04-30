import { JSONPOD } from "@pcd/pod";
import { verifyPodInternalSignature, checkPodSigner, getPodDataValue } from "./podVerification";
import { VisaStatus, issueVisaPod, createVisaProof, verifyVisaProof } from "./visa-pod";

// Example visa pod for testing
const exampleVisaPod: JSONPOD = {
  entries: {
    "holder_address": "0x1234567890abcdef",
    "holder_name": "Test User",
    "status": 3,
    "issue_date": 1746017731692,
    "expiry_date": 1777553731692,
    "pod_data_type": "evefrontier.visa"
  },
  signature: "mock_signature_" + Buffer.from(JSON.stringify({
    "holder_address": "0x1234567890abcdef",
    "holder_name": "Test User",
    "status": 3,
    "issue_date": 1746017731692,
    "expiry_date": 1777553731692,
    "pod_data_type": "evefrontier.visa"
  })).toString("base64"),
  signerPublicKey: "mock_public_key_for_corp_123"
};

// The authority public key should match the one used to generate pods
const AUTHORITY_PUB_KEY = "mock_public_key_for_corp_123";

function verifyVisaPod(pod: JSONPOD): boolean {
  // 1. Verify internal signature
  if (!verifyPodInternalSignature(pod)) {
    console.log("❌ Pod's internal signature is invalid");
    return false;
  }
  console.log("✅ Pod's internal signature is valid");

  // 2. Verify authority signature
  if (!checkPodSigner(pod, AUTHORITY_PUB_KEY)) {
    console.log("❌ Pod is not signed by the correct authority");
    return false;
  }
  console.log("✅ Pod is signed by the correct authority");

  // 3. Verify required fields
  const requiredFields = ["holder_address", "holder_name", "status", "issue_date", "expiry_date", "pod_data_type"];
  for (const field of requiredFields) {
    if (!pod.entries[field]) {
      console.log(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  console.log("✅ All required fields are present");

  // 4. Verify pod type
  if (pod.entries.pod_data_type !== "evefrontier.visa") {
    console.log("❌ Invalid pod type");
    return false;
  }
  console.log("✅ Pod type is correct");

  // 5. Verify dates
  const currentTime = Date.now();
  const issueDate = Number(pod.entries.issue_date);
  const expiryDate = Number(pod.entries.expiry_date);

  if (currentTime < issueDate) {
    console.log("❌ Visa has not been issued yet");
    return false;
  }
  console.log("✅ Issue date is valid");

  if (currentTime > expiryDate) {
    console.log("❌ Visa has expired");
    return false;
  }
  console.log("✅ Visa is still valid");

  return true;
}

// Example usage
async function main() {
  console.log("🔍 Verifying Visa Pod...\n");
  
  const result = verifyVisaPod(exampleVisaPod);
  
  console.log("Verification Results:");
  console.log(`Final Result: ${result ? "VALID" : "INVALID"}`);
  
  if (result) {
    console.log("\nPod Details:");
    console.log(`Holder: ${exampleVisaPod.entries.holder_name} (${exampleVisaPod.entries.holder_address})`);
    console.log(`Status: ${VisaStatus[exampleVisaPod.entries.status as number]}`);
    console.log(`Issue Date: ${new Date(exampleVisaPod.entries.issue_date as number).toLocaleDateString()}`);
    console.log(`Expiry Date: ${new Date(exampleVisaPod.entries.expiry_date as number).toLocaleDateString()}`);

    // Create and verify a proof
    console.log("\n🔍 Testing Proof Creation and Verification...");
    const { proof, config } = await createVisaProof(exampleVisaPod, true);
    const proofValid = await verifyVisaProof(proof, config);
    console.log("Proof Verification:", proofValid ? "✅ VALID" : "❌ INVALID");
    if (proofValid) {
      console.log("Revealed Status:", exampleVisaPod.entries.status);
    }
  }
}

// Run the example
main().catch(console.error); 