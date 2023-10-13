import { struct, u32, ns64 } from "@solana/buffer-layout";
import { Buffer } from "buffer";
import web3 from "@solana/web3.js";
import * as borsh from "borsh";
import { Project, ProjectSchema } from "../schemas/projectSchema.js";

// Define the cluster API URL
const clusterApiUrl = "https://api.devnet.solana.com"; // Change to the appropriate network

// Generate a new keypair for the user
const userKeypair = web3.Keypair.generate();
console.log("User public key:", userKeypair.publicKey.toBase58());

// Generate a new keypair for the payer
const payerKeypair = web3.Keypair.generate();
console.log("Payer public key:", payerKeypair.publicKey.toBase58());

// Connect to the Solana cluster
const connection = new web3.Connection(clusterApiUrl);

(async () => {
  // Request an airdrop for the payer account
  const airdropSignature = await connection.requestAirdrop(
    payerKeypair.publicKey,
    web3.LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSignature);

  const recentBlockhash = await connection.getRecentBlockhash();

  // Create a transaction
  const transaction = new web3.Transaction({
    feePayer: payerKeypair.publicKey,
    recentBlockhash: recentBlockhash.blockhash,
  });

  // Define the program ID of the Solana program
  const programId = new web3.PublicKey(
    "BfE5siVdPnnezakBy37mvVABQfSCNZyoijLZFmxzjoDu"
  ); // Replace with your program's ID

  // Define the keys for the transaction
  const keys = [
    { pubkey: userKeypair.publicKey, isSigner: true, isWritable: true },
  ];

  // Define parameters for your instruction
  const params = { space: 100 }; // Customize the parameters as needed

  // Define the structure of the instruction
  const allocateStruct = {
    index: 8,
    layout: struct([u32("instruction"), ns64("space")]),
  };

  // Allocate space for the instruction data
  const data = Buffer.alloc(allocateStruct.layout.span);
  const layoutFields = Object.assign(
    { instruction: allocateStruct.index },
    params
  );
  allocateStruct.layout.encode(layoutFields, data);

  const createProjectData = {
    name: "My Project", // Customize with your project's name
    projectType: "Type A", // Customize with your project's type
    description: "Project description", // Customize with your project's description
  };

  const serializedData = encodeCreateProjectData(createProjectData);

  // Add the instruction to the transaction
  transaction.add(
    new web3.TransactionInstruction({
      keys,
      programId,
      data: serializedData,
    })
  );

  // Sign and send the transaction
  transaction.sign(payerKeypair, userKeypair);
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payerKeypair, userKeypair]
  );

  console.log("Transaction signature:", signature);

  // Fetch the user account to verify the result
  const userAccount = await connection.getAccountInfo(userKeypair.publicKey);
  console.log("User account data:", userAccount.data.toString());

  // Close the connection
  connection.disconnect();
})();

function encodeCreateProjectData(data) {
  // Create a new project object with the provided data
  const project = new Project({
    owner: userKeypair.publicKey.toBuffer(),
    name: data.name,
    projectType: data.projectType,
    description: data.description,
  });

  // Serialize the project data using Borsh and the projectSchema
  const buffer = borsh.serialize(ProjectSchema, project);

  return buffer;
}
