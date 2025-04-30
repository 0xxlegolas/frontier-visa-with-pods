import { JSONPOD } from "@pcd/pod";
import { verifyPodInternalSignature, checkPodSigner } from "./podVerification";

// Example killmail pod for testing
const exampleKillmailPod: JSONPOD = {
  "entries": {
    "killer_address": "0x296faad88bf98348221e7fbeae81ba1e863d29c2",
    "killer_name": "Afsaty",
    "loss_type": "ship",
    "pod_data_type": "evefrontier.killmail",
    "solar_system_id": 30010690,
    "timestamp": {
      "int": "0x1dbaaf914329700"
    },
    "victim_address": "0x4cd060b7df974a18e9157238915cde03bf95b2d8",
    "victim_name": "Gvulf"
  },
  "signature": "XTjMpGwZE9OyXYKBwDBkviD2EU8eJxA/qKImJmggNxy0j4iBpNsqrk/WLlNezkGZIuNU56GwDoic/RN+Ei3jAg",
  "signerPublicKey": "Mc2IbgO1ihBqpoPgE4WacZcORWNfNJko5v9rg4o2AiM"
};

// The authority public key should match the one used to generate pods
const AUTHORITY_PUB_KEY = "Mc2IbgO1ihBqpoPgE4WacZcORWNfNJko5v9rg4o2AiM";

function verifyKillmailPod(pod: JSONPOD): { isValid: boolean; messages: string[] } {
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
}

// Example usage
function main() {
  console.log("🔍 Verifying Killmail Pod...\n");
  
  const result = verifyKillmailPod(exampleKillmailPod);
  
  console.log("Verification Results:");
  result.messages.forEach(msg => console.log(msg));
  console.log("\nFinal Result:", result.isValid ? "✅ VALID" : "❌ INVALID");
  
  if (result.isValid) {
    console.log("\nPod Details:");
    console.log(`Killer: ${exampleKillmailPod.entries.killer_name} (${exampleKillmailPod.entries.killer_address})`);
    console.log(`Victim: ${exampleKillmailPod.entries.victim_name} (${exampleKillmailPod.entries.victim_address})`);
    console.log(`System ID: ${exampleKillmailPod.entries.solar_system_id}`);
    console.log(`Loss Type: ${exampleKillmailPod.entries.loss_type}`);
  }
}

// Run the example
main();