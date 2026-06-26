import type { CourierParser } from "@/lib/parsers/types";
import { genericParser } from "@/lib/parsers/generic";

export const acsParser: CourierParser = {
  name: "acs",
  matches(text) {
    return /\bACS\b/i.test(text);
  },
  parse(text) {
    return { ...genericParser.parse(text), courier: "acs" };
  }
};
