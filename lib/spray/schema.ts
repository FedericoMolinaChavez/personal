import { z } from "zod";

/**
 * Strict schema for a spray application record extracted from a photo/note.
 * Every field is nullable: the model must return null rather than invent a
 * product, rate, EPA number, or date it can't read. (Structured-output JSON
 * schema doesn't support numeric/string constraints, so confidence is a plain
 * number validated in code.)
 */
export const sprayRecordSchema = z.object({
  product: z.string().nullable().describe("Product / pesticide trade name"),
  epa_reg_no: z
    .string()
    .nullable()
    .describe("EPA registration number, e.g. 524-549"),
  rate: z
    .number()
    .nullable()
    .describe("Application rate — the numeric amount per acre"),
  unit: z
    .string()
    .nullable()
    .describe("Rate unit, e.g. 'oz/acre', 'pt/acre', 'lb/acre'"),
  field_block: z
    .string()
    .nullable()
    .describe("Field or block name / identifier"),
  acres: z.number().nullable().describe("Acres treated"),
  applied_at: z
    .string()
    .nullable()
    .describe("Application date/time as ISO 8601 if determinable"),
  applicator: z.string().nullable().describe("Name of the applicator"),
  wind_speed: z
    .number()
    .nullable()
    .describe("Wind speed in mph at application time"),
  target_pest: z
    .string()
    .nullable()
    .describe("Target pest / weed / disease"),
  confidence: z
    .number()
    .describe("Overall confidence the extraction is correct, from 0 to 1"),
  notes: z
    .string()
    .nullable()
    .describe("Anything ambiguous or illegible worth flagging for review"),
});

export type SprayRecordDraft = z.infer<typeof sprayRecordSchema>;
