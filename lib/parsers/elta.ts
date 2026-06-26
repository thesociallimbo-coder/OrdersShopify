import type { CourierParser } from "@/lib/parsers/types";
import { genericParser } from "@/lib/parsers/generic";

export const eltaParser: CourierParser = {
  name: "elta",
  matches(text) {
    return /\b(ELTA|Hellenic Post)\b/i.test(text);
  },
  parse(text) {
    return { ...genericParser.parse(text), courier: "elta" };
  }
};
