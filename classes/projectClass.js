import { serialize, deserialize } from "borsh";

class Project {
  constructor(fields = undefined) {
    if (fields) {
      this.owner = fields.owner;
      this.name = fields.name;
      this.projectType = fields.projectType;
      this.description = fields.description;
    }
  }
}
