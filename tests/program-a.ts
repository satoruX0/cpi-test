import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProgramA } from "../target/types/program_a";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { ProgramB } from "../target/types/program_b";

describe("program-a", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const programa = anchor.workspace.programA as Program<ProgramA>;
  const programb = anchor.workspace.programA as Program<ProgramB>;
  const provider = anchor.getProvider();
  const wallet = provider.wallet;
  it("Is initialized!", async () => {
    const [pdaAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("pda"), wallet.publicKey.toBuffer()],
      programa.programId
    ); // Add your test here.
    // Fund the PDA account first since it needs to transfer 1 SOL
    const fundTx = await programa.provider.connection.requestAirdrop(
      pdaAccount,
      2 * anchor.web3.LAMPORTS_PER_SOL // Fund with 2 SOL to be safe
    );
    await programb.provider.connection.confirmTransaction(fundTx);

    console.log("PDA Account:", pdaAccount.toString());
    console.log("Signer:", wallet.publicKey.toString());
    const tx = await programa.methods
      .initialize()
      .accounts({
        // pdaAccount,
        signer: wallet.publicKey,
        // systemProgram: SystemProgram.programId,
        // programb: programb.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
