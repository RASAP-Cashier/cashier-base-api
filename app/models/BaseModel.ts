import { Model } from "objection";

export class BaseModel extends Model {
  id!: number;
  is_deleted?: boolean;
  created_at!: Date;
  updated_at!: Date;
  created_by?: string;
  updated_by?: string;
}
