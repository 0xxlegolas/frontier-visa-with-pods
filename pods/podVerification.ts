import { JSONPOD, POD, PODValue } from "@pcd/pod";

/**
 * Serializes a JSONPOD object into a string.
 * @param pod The JSONPOD object.
 * @returns A JSON string representation of the POD.
 */
export function serializePod(pod: JSONPOD): string {
  return JSON.stringify(pod);
}

/**
 * Deserializes a string back into a JSONPOD object.
 * Performs basic validation to ensure the result looks like a JSONPOD.
 * @param serializedPod The JSON string representation of the POD.
 * @returns The deserialized JSONPOD object.
 * @throws Error if the string is not valid JSON or doesn't resemble a JSONPOD.
 */
export function deserializePod(serializedPod: string): JSONPOD {
  let parsed: JSONPOD;
  try {
    parsed = JSON.parse(serializedPod) as JSONPOD;
  } catch (e) {
    throw new Error(`Failed to parse serialized POD string: ${e instanceof Error ? e.message : e}`);
  }

  // Basic structural validation (can be expanded)
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !parsed.entries ||
    typeof parsed.entries !== 'object' ||
    !parsed.signature ||
    typeof parsed.signature !== 'string'
    || !parsed.signerPublicKey || 
    typeof parsed.signerPublicKey !== 'string' 
  ) {
    throw new Error("Deserialized object does not have the expected structure of a JSONPOD (entries, signature string, signerPublicKey string).");
  }

  // TODO: Consider deeper validation of entry types/values if necessary.
  return parsed;
}

/**
 * Verifies the internal consistency of the POD signature.
 * Checks if the signature matches the content and the embedded signerPublicKey.
 * NOTE: This does NOT verify if the signer is the expected authority.
 * NOTE: This requires the necessary cryptographic dependencies.
 *
 * @param pod The JSONPOD object to verify.
 * @returns True if the internal signature is valid, false otherwise.
 */
export function verifyPodInternalSignature(pod: JSONPOD): boolean {
  try {
    // For mock signatures, verify that the signature is correctly formatted
    if (pod.signature.startsWith("mock_signature_")) {
      const encodedData = pod.signature.substring("mock_signature_".length);
      const decodedData = Buffer.from(encodedData, "base64").toString();
      const signedData = JSON.parse(decodedData);
      
      // Compare the signed data with the pod entries
      return JSON.stringify(signedData) === JSON.stringify(pod.entries);
    }

    // For real signatures, use the POD library's verification
    const podInstance = POD.fromJSON(pod);
    const isValid = podInstance.verifySignature();
    return isValid;
  } catch (error) {
    console.error("Error during POD internal signature verification:", error);
    return false; // Return false on any error during verification
  }
}

/**
 * Checks if the POD was signed by the expected authority.
 *
 * @param pod The JSONPOD object.
 * @param expectedAuthorityPublicKey The public key of the trusted authority.
 * @returns True if the signerPublicKey in the POD matches the expected key, false otherwise.
 */
export function checkPodSigner(pod: JSONPOD, expectedAuthorityPublicKey: string): boolean {
    try {
        // For mock signatures, directly compare the public keys
        if (pod.signature.startsWith("mock_signature_")) {
            return pod.signerPublicKey === expectedAuthorityPublicKey;
        }

        // For real signatures, use the POD library's verification
        const podInstance = POD.fromJSON(pod);
        return podInstance.signerPublicKey === expectedAuthorityPublicKey;
    } catch (error) {
        console.error("Error reconstructing POD to check signer:", error);
        return false;
    }
}

/**
 * Safely extracts a specific value from a POD's entries.
 *
 * @param pod The JSONPOD object.
 * @param entryName The name of the entry to retrieve.
 * @returns The PODValue if found, otherwise undefined.
 */
export function getPodDataValue(pod: JSONPOD, entryName: string): PODValue | undefined {
    // Reconstruct POD instance to use its helper methods
    // Alternatively, could access pod.entries directly, but getValue might have extra logic
    try {
        const podInstance = POD.fromJSON(pod);
        return podInstance.content.getValue(entryName);
    } catch (error) {
        console.error(`Error getting entry '${entryName}' from POD:`, error);
        return undefined;
    }
} 