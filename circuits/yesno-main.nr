use affix_lib::attestation::verify_payload_fingerprint;
use affix_lib::nullifier::verify_nullifier;

fn main(
    secret: Field,
    claim_a_hash: Field,
    claim_b_hash: Field,
    claim_c_hash: Field,
    valid_from: u32,
    valid_until: u32,
    issuer_pubkey_hash: pub Field,
    schema_id: pub Field,
    required_a_hash: pub Field,
    required_b_hash: pub Field,
    required_c_hash: pub Field,
    logic_mode: pub Field,
    context_id: pub Field,
    credential_id: pub Field,
    payload_digest: pub Field,
    nullifier: pub Field,
) -> pub Field {
    let combined_claim = claim_a_hash + claim_b_hash + claim_c_hash;
    let commitment_ok = verify_payload_fingerprint(
        issuer_pubkey_hash,
        schema_id,
        combined_claim,
        valid_from as Field,
        valid_until as Field,
        payload_digest,
    );

    let a_ok = claim_a_hash == required_a_hash;
    let b_ok = claim_b_hash == required_b_hash;
    let c_ok = claim_c_hash == required_c_hash;
    let and_ok = a_ok & b_ok & c_ok;
    let or_ok = a_ok | b_ok | c_ok;
    let logic_ok = if logic_mode == 0 { and_ok } else { or_ok };
    let nullifier_ok = verify_nullifier(secret, context_id, credential_id, nullifier);

    if commitment_ok & logic_ok & nullifier_ok { 1 } else { 0 }
}
