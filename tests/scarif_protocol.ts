import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ScarifProtocol, IDL } from "../target/types/scarif_protocol";
import {
  PublicKey,
  SystemProgram,
  ComputeBudgetProgram,
  sendAndConfirmTransaction,
  Keypair,
  Transaction,
  Connection,
  DataSizeFilter, 
  GetProgramAccountsConfig
} from "@solana/web3.js";

describe("scarif_protocol", () => {
  const wallet = anchor.Wallet.local();
  console.log('wallet', wallet.publicKey.toBase58());
  const provider = anchor.getProvider();
  const connection = new Connection("https://api.devnet.solana.com", "finalized");
  const programId = new PublicKey("CQEfxUz92WbUBK5XCBrUi6rNizELuY8RqUjbp9XYiMyH");

  const program = new anchor.Program<ScarifProtocol>(IDL, programId, provider);
  

  // Helpers
  function wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block
    })
    return signature
  }

  const log = async(signature: string): Promise<string> => {
    console.log(`Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=devnet`);
    return signature;
  }

 
  async function getTotalCollections() {
    const size_filter: DataSizeFilter = {
      dataSize: 1968
    };
    const get_accounts_config: GetProgramAccountsConfig = {
        commitment: "confirmed",
        filters: [size_filter]
    };
    // get all profiles and check if username exists
    const collections = await connection.getProgramAccounts(programId, 
      get_accounts_config
    );
    console.log('collections', collections);
    const totalCollections = collections.length;
    console.log('totalProfiles', totalCollections);
    
    return totalCollections;
  }

  const auth = PublicKey.findProgramAddressSync([Buffer.from('auth')], program.programId)[0];
  const adminState = PublicKey.findProgramAddressSync([Buffer.from('admin_state'), wallet.publicKey.toBuffer()], program.programId)[0];

  const collectionPda = PublicKey.findProgramAddressSync([Buffer.from('collection'), wallet.publicKey.toBuffer()], program.programId)[0];
 

  // it ("Initialize a new Admin", async () => {
  //   const username = "MATT";
  //   console.log('system program id', SystemProgram.programId.toBase58());
  //   const createAdminIx = await program.methods
  //   .accounts({
  //     admin: wallet.publicKey,
  //     adminState: null,
  //     newAdmin: wallet.publicKey,
  //     newAdminState: adminState,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .signers([wallet.payer])
  //   .instruction()
    

  //   const tx = new anchor.web3.Transaction().add(createAdminIx);
  //   await sendAndConfirmTransaction(connection, tx, [wallet.payer], {commitment: "finalized", skipPreflight: true}).then(confirm).then(log);
  // });

  it("Create a Collection", async () => {
      // const transaction = new Transaction().add(
      //   await program.methods
      //   .initializeCollectionAccount()
      //   .accounts({
      //     collection: collectionPda,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .instruction()
      // );
      
      // await sendAndConfirmTransaction(connection, transaction, [wallet.payer], {commitment: "finalized", skipPreflight: true}).then(confirm).then(log);
      await getTotalCollections();
  });

  it("Add Nft to Collection", async () => {
    const mint = new PublicKey("ARBofYtiiKzXGWaWQZhyvCw2eXzsSACy3taWQgLpdEbX");
    const pubKey = wallet.publicKey;
    const transaction = new Transaction().add(
      await program.methods
      .addNft(
        mint,
        pubKey
      )
      .accounts({
        collection: collectionPda,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
    );
    transaction.feePayer = wallet.publicKey;
    
    await sendAndConfirmTransaction(connection, transaction, [wallet.payer], {commitment: "finalized", skipPreflight: true}).then(confirm).then(log);
  
  })
});
