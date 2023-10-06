import { LINK_TYPES } from "../constants";

export interface GenerateLinkDto {
  type: LINK_TYPES;

  post_id?: number;
  nickname?: string;
}
