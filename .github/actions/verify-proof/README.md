# AffixIO Verify Proof (GitHub Action)

Composite action that verifies a zero-knowledge proof against `api.affix-io.com` before deploy.

## Usage

```yaml
- uses: AffixIO/SDK/.github/actions/verify-proof@main
  with:
    api_key: ${{ secrets.AFFIX_API_KEY }}
    circuit_id: yesno
    proof: ${{ env.AFFIX_PROOF }}
```

The action bundles the Sectigo intermediate CA so TLS works even when the API host omits the full chain.
