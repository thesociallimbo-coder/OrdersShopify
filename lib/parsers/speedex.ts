import type { CourierParser } from "@/lib/parsers/types";
import { genericParser } from "@/lib/parsers/generic";

export const speedexParser: CourierParser = {
  name: "speedex",
  matches(text) {
    return /\bSpeedex\b/i.test(text);
  },
  parse(text) {
    return { ...genericParser.parse(text), courier: "speedex" };
  }
};
