import { acsParser } from "@/lib/parsers/acs";
import { boxnowParser } from "@/lib/parsers/boxnow";
import { eltaParser } from "@/lib/parsers/elta";
import { genericParser } from "@/lib/parsers/generic";
import { speedexParser } from "@/lib/parsers/speedex";

const parsers = [acsParser, speedexParser, eltaParser, boxnowParser, genericParser];

export function parseCourierReport(text: string) {
  const parser = parsers.find((candidate) => candidate.matches(text)) ?? genericParser;
  return parser.parse(text);
}
