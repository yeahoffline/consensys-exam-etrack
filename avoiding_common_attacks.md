# Avoiding Common Attacks

Reference:
https://www.kingoftheether.com/contract-safety-checklist.html

## Logic Bugs
Covered by on-chain functional tests. The test framework should cover all logic bugs. The codebase uses simple and straight forward functions.

## Failed Sends
not relevant: no payable functions

## Recursive Calls
not relevant: no recursive calls

## Integer Arithmetic Overflow
Every powerplant or powermeter uses a separate ID and values.

## Poison Data
Accepted data is within uint range. No additional checks necessary

## Exposed Functions
Functions use the isOwner check to validate the caller

## Exposed Secrets
not relevant

## Denial of Service / Dust Spam
not possible, every function uses isOwner to validate the caller

## Miner Vulnerabilities
not relevant

## Malicious Creator
all the data is owner related

## Off-chain Safety
out of scope, a TODO later

## Cross-chain Replay Attacks
out of scope, a TODO later

## Tx.Origin Problem
not used

## Solidity Function Signatures and Fallback Data Collisions
out of scope, a TODO later

## Incorrect use of Cryptography
not used

## Gas Limits
no loops used, user-supplied data is limited to uint

## Stack Depth Exhaustion
not used
