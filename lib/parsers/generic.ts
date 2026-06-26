import type { CourierParser } from "@/lib/parsers/types";

const DEFAULT_ORDER_REGEX = /(?:#|order\s*number\s*:?\s*)?(\d{4,12})/gi;

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.replace(/^#/, "").trim()).filter(Boolean))];
}

export const genericParser: CourierParser = {
  name: "generic",
  matches() {
    return true;
  },
  parse(text) {
    const matches = [...text.matchAll(DEFAULT_ORDER_REGEX)].map((match) => match[1]);
    return { courier: "generic", orderNumbers: unique(matches) };
  }
};
