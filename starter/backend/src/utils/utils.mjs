import { parseUserId } from "../auth/utils.mjs";

export function extractUserId(event) {
    const authorizationHeader = event.headers?.Authorization;

    if (!authorizationHeader) {
      throw new Error("Authorization header missing in the request");
    }
  
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new Error("JWT token missing in the Authorization header");
    }

  return parseUserId(token);
}