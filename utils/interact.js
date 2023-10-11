import solanaWeb3 from "@solana/web3.js";
import { Project, ProjectSchema } from "../schemas/projectSchema.js";
import * as borsh from "borsh";
import dotenv from "dotenv";
dotenv.config();

const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl("devnet")
);
console.log("Cojnbkhsdvys", connection);
const programId = new solanaWeb3.PublicKey(
  "BfE5siVdPnnezakBy37mvVABQfSCNZyoijLZFmxzjoDu"
);
const payerPublicKey = new solanaWeb3.PublicKey(
  "CL2Y8m82pez1hdKGq9YfQyckULJderUM5vyoEEFAQeee"
);

const accountInfo = await connection.getAccountInfo(payerPublicKey);
console.log("Data size:", accountInfo.data.length);

async function createNewAccount(dataSize) {
  const secretKey = Uint8Array.from(JSON.parse(process.env.PAYER_SECRET_KEY));
  const payer = solanaWeb3.Keypair.fromSecretKey(secretKey);
  const newAccount = solanaWeb3.Keypair.generate();

  // Get the recent blockhash
  const blockhash = await connection.getRecentBlockhash();

  // Define your instructions here (replace with actual instructions)
  const instructions = [
    solanaWeb3.SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(dataSize),
      space: dataSize,
      programId, // Make sure programId is correctly defined
    }),
    // Add other instructions here as needed
  ];

  const createAccountTransaction = new solanaWeb3.Transaction({
    recentBlockhash: blockhash,
  }).add(...instructions);

  // Sign the transaction
  createAccountTransaction.sign(payer, newAccount);

  // Send and confirm the transaction
  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    createAccountTransaction,
    [payer, newAccount],
    { commitment: "confirmed" }
  );

  console.log("New account created:", newAccount.publicKey.toBase58());
  return newAccount;
}

function encodeCreateProjectData(data) {
  const project = new Project({
    owner: new Uint8Array(32), // TODO: Set the actual owner
    name: data.name,
    projectType: data.projectType,
    description: data.description,
  });
  console.log("Project", project);
  return borsh.serialize(ProjectSchema, project);
}

export async function createProjectOnchain(req, res) {
  try {
    // Set up payer with environment variable
    console.log("jggju", process.env.PAYER_SECRET_KEY);
    const secretKey = Uint8Array.from(JSON.parse(process.env.PAYER_SECRET_KEY));
    let payer = solanaWeb3.Keypair.fromSecretKey(secretKey);

    // Extract data from request body
    const data = req.body;

    // Encode your instruction data
    const createProjectData = encodeCreateProjectData(data);
    console.log("Serialized ", Array.from(createProjectData));

    // Determine the estimated data size
    const estimatedDataSize =
      32 +
      ("Test Project".length + "Test".length + "Trial description".length) * 1 +
      12;

    // Create a new account with the required data size
    const newAccount = await createNewAccount(estimatedDataSize);
    console.log("New account", newAccount);
    // Update the transaction instruction to use the new account
    const instruction = new solanaWeb3.TransactionInstruction({
      keys: [
        { pubkey: newAccount.publicKey, isSigner: true, isWritable: true },
      ],
      programId,
      data: createProjectData,
    });

    // Create, sign and send the transaction
    const transaction = new solanaWeb3.Transaction().add(instruction);
    transaction.feePayer = payer.publicKey;
    await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [
      payer,
    ]);

    res.status(200).send("Project created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating project");
  }
}

// function encodeCreateProjectData(data) {
//   const { name, projectType, description } = data;

//   // Convert string data to Buffer and prefix with length
//   const nameBuffer = Buffer.from(name, "utf-8");
//   const nameLength = Buffer.alloc(4); // Assuming you won't have a string longer than 2^32 - 1
//   nameLength.writeUInt32BE(nameBuffer.length, 0);

//   const projectTypeBuffer = Buffer.from(projectType, "utf-8");
//   const projectTypeLength = Buffer.alloc(4);
//   projectTypeLength.writeUInt32BE(projectTypeBuffer.length, 0);

//   const descriptionBuffer = Buffer.from(description, "utf-8");
//   const descriptionLength = Buffer.alloc(4);
//   descriptionLength.writeUInt32BE(descriptionBuffer.length, 0);

//   // Combine buffers into a single buffer
//   const combinedBuffer = Buffer.concat([
//     nameLength,
//     nameBuffer,
//     projectTypeLength,
//     projectTypeBuffer,
//     descriptionLength,
//     descriptionBuffer,
//   ]);

//   return combinedBuffer;
// }
