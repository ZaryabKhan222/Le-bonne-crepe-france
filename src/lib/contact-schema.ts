import { z } from "zod";

export const contactSubjects = ["General", "Catering Inquiry", "Feedback"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(100),
  email: z.string().trim().email("That email does not look right").max(200),
  phone: z
    .string()
    .trim()
    .max(30, "That phone number looks too long")
    .optional()
    .or(z.literal("")),
  subject: z.enum(contactSubjects),
  message: z.string().trim().min(10, "Tell us a little more (10 characters minimum)").max(5000),
  // Honeypot: humans never see or fill this field. Any value is accepted by
  // the schema so the API can quietly discard bot submissions instead of
  // returning a validation error that tips the bot off.
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
