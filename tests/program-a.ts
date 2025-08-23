import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProgramA } from "../target/types/program_a";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("program-a", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.programA as Program<ProgramA>;
  const provider = anchor.getProvider();
  const wallet = provider.wallet;
  it("Is initialized!", async () => {
    const [pdaAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("pda"), wallet.publicKey.toBuffer()],
      program.programId
    ); // Add your test here.
    // Fund the PDA account first since it needs to transfer 1 SOL
    const fundTx = await program.provider.connection.requestAirdrop(
      pdaAccount,
      500_000_000 * anchor.web3.LAMPORTS_PER_SOL // Fund with 2 SOL to be safe
    );
    await program.provider.connection.confirmTransaction(fundTx);

    console.log("PDA Account:", pdaAccount.toString());
    console.log("Signer:", wallet.publicKey.toString());
    const tx = await program.methods
      .initialize()
      .accounts({
        // pdaAccount,
        signer: wallet.publicKey,
        // systemProgram: SystemProgram.programId,
        // programB: PROGRAM_B_ID,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
