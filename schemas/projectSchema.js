import * as borsh from "@project-serum/borsh";

class Project {
  constructor(fields = undefined) {
    if (fields) {
      this.owner = fields.owner; // Using array of u8 instead of Uint8Array
      this.name = fields.name;
      this.type = fields.type;
      this.description = fields.description;
    }
  }
}

const ProjectSchema = {
  struct: {
    owner: { array: { type: "u8", len: 32 } }, // Assuming owner is an array of u8 with length 32
    name: "string",
    type: "string",
    description: "string",
  },
};

export { Project, ProjectSchema, borsh };

