use affix_lib::attestation::verify_payload_fingerprint;
use affix_lib::nullifier::verify_nullifier;

fn main(
    secret: Field,
    claim_hash: Field,
    valid_from: u32,
    valid_until: u32,
    issuer_pubkey_hash: pub Field,
    schema_id: pub Field,
    required_claim_hash: pub Field,
    context_id: pub Field,
    credential_id: pub Field,
    payload_digest: pub Field,
    nullifier: pub Field,
) -> pub Field {
    let commitment_ok = verify_payload_fingerprint(
        issuer_pubkey_hash,
        schema_id,
        claim_hash,
        valid_from as Field,
        valid_until as Field,
        payload_digest,
    );
    let claim_ok = claim_hash == required_claim_hash;
    let nullifier_ok = verify_nullifier(secret, context_id, credential_id, nullifier);

    if commitment_ok & claim_ok & nullifier_ok { 1 } else { 0 }
}
