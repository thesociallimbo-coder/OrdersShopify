export type ParsedCourierReport = {
  courier: string;
  orderNumbers: string[];
};

export type CourierParser = {
  name: string;
  matches(text: string): boolean;
  parse(text: string): ParsedCourierReport;
};
