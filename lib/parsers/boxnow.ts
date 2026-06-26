import type { CourierParser } from "@/lib/parsers/types";
import { genericParser } from "@/lib/parsers/generic";

export const boxnowParser: CourierParser = {
  name: "boxnow",
  matches(text) {
    return /\bBOX\s?NOW\b/i.test(text);
  },
  parse(text) {
    return { ...genericParser.parse(text), courier: "boxnow" };
  }
};
