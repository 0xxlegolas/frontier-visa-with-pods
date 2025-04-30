//Import Packages
import { POD, PODEntries, JSONPOD, PODValue, podValueFromJSON, deriveSignerPublicKey } from "@pcd/pod";
 
import {
    gpcArtifactDownloadURL,
    GPCProofConfig, gpcProve,
    gpcVerify,
    boundConfigToJSON, revealedClaimsToJSON 
} from "@pcd/gpc";
 
const artifactURL = gpcArtifactDownloadURL(
    "jsdelivr",
    "prod",
    undefined
  )

//POD Data
const privateSigningKey = "2851153af6e862439ff91253684f85a6357ec7a3edcec4324de1eb7db4431ea5";

// Visa status levels
export enum VisaStatus {
    NONE = 0,
    BLUE = 1,    // Basic access
    GREEN = 2,   // Advanced access
    GOLDEN = 3   // Elite access
  }
  
/**
 * Checks if the POD was signed by the expected authority.
 *
 * @param pod The JSONPOD object.
 * @param expectedAuthorityPublicKey The public key of the trusted authority.
 * @returns True if the signerPublicKey in the POD matches the expected key, false otherwise.
 */
export async function createVisaPod(SCA: string, expiryDate: Date, securityLevel: VisaStatus) {

    const visaEntries: PODEntries = {
        security_level: {
            type: "int",
            value: BigInt(securityLevel)
        },
        holder_smart_character_address: {
            type: "string",
            value: SCA
        },
        issued_date: {
            type: "date",
            value: new Date("2025-04-10T00:00:00.000Z")
        },
        expiry_date: {
            type: "date",
            value: expiryDate
        },
        pod_type: { type: "string", value: "corpName.security_badge" },
    };

    const getProof = async (myPOD: JSONPOD) => {
        const proof = await CreateProof(myPOD);
        console.log('proof');
        return proof;
    }

    try {
        console.log("Create Visa POD");
        // Reconstruct the POD instance to safely access signerPublicKey
        const myPOD = POD.sign(visaEntries, privateSigningKey);
        console.log
        const proof = await getProof(myPOD);
        console.log('Create Visa POD',proof);
        return proof;

    } catch (error) {
        console.error("Error signing POD ", error);
        return false;
    }
}

//Your PRIVATE signing key
 
//Create the POD
 
//Output Signer Public Key
const publicSigningKey = deriveSignerPublicKey(privateSigningKey);
console.log("\nSigner Public Key")
console.log(publicSigningKey + "\n")
 
 
//Create the Proof Config
const proofConfig: GPCProofConfig = {
    pods: {
        security_badge: {
            entries: {
                security_level: { 
                    isRevealed: false,
                    inRange: {
                        min: 3n,
                        max: 10n
                    }
                },
                holder_smart_character_address: { isRevealed: true },
                issued_date: {
                    isRevealed: false,
                    inRange: {
                        min: 0n,
                        max: BigInt(new Date("2026-05-10T00:00:00.000Z").getTime())
                    }
                },
                expiry_date: {
                    isRevealed: false,
                    inRange: {
                        min: BigInt(new Date("2024-05-10T00:00:00.000Z").getTime()),
                        max: BigInt(new Date("2030-04-10T00:00:00.000Z").getTime())
                    }
                },
                pod_type: { isRevealed: true }
            }
        }
    }
};
 
async function CreateProof(myPOD: JSONPOD){
    console.log('Creating proof');
    const proofInputs = {
        pods: {
            security_badge: myPOD
        }
    }
     
    //Create the proof
    const { proof, boundConfig, revealedClaims } = await gpcProve(
        proofConfig,
        proofInputs,
        artifactURL
    );
 
    //Convert proof information to JSON
    const proofMessage = JSON.stringify({
        proof: proof,
        boundConfig: boundConfigToJSON(boundConfig),
        revealedClaims: revealedClaimsToJSON(revealedClaims)
    });
 
    return proofMessage;
}
 
