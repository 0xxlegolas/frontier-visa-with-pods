import { JSONPOD } from "@pcd/pod";
import { verifyPodInternalSignature, checkPodSigner } from "./podVerification";

// Example killmail pod for testing
const exampleKillmailPod: JSONPOD = {
    "entries": {
      "killer_address": "0x019eef303301206b3f314b787c614dd127db1e70",
      "killer_name": "Dolo Hack",
      "loss_type": "ship",
      "pod_data_type": "evefrontier.killmail",
      "solar_system_id": 30020308,
      "timestamp": {
        "int": "0x1dbaaf914329700"
      },
      "victim_address": "0x58ddc5a86b8bb3702639ad48fca446c8bc0e4772",
      "victim_name": "DGent"
    },
    "signature": "y73tkxoHnZQzGpHfbJu+l8WRASKczDANiaZS4JJ9YQCFjxZgYTVUTpew2lGhIlqpfZpEqg81sRoOMpyPXxcqBQ",
    "signerPublicKey": "GSDrthtjD/t5bSrLMMvnjeqJrtdjFxmhD0nfo/3fkpo"
  };

// The authority public key should match the one used to generate pods
const AUTHORITY_PUB_KEY = "GSDrthtjD/t5bSrLMMvnjeqJrtdjFxmhD0nfo/3fkpo";

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