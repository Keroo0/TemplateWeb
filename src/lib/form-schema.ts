import { z } from "zod";

import type { Json } from "@/lib/supabase/database.types";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_TOTAL_UPLOAD_BYTES = 20 * 1024 * 1024;
export const ALLOWED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
] as const;

const fieldTypeSchema = z.enum(["text", "textarea", "date", "file"]);

export const templateFieldSchema = z.object({
  name: z.string().regex(/^[a-zA-Z0-9_]+$/),
  label: z.string().min(1),
  type: fieldTypeSchema,
  required: z.boolean().default(false)
});

export type TemplateField = z.infer<typeof templateFieldSchema>;

export const uploadMetadataSchema = z.object({
  field_name: z.string().min(1),
  filename: z.string().min(1),
  mime_type: z.string().min(1),
  size_bytes: z.number().int().min(0).max(MAX_FILE_SIZE_BYTES)
});

export function parseTemplateFields(formSchema: Json): TemplateField[] {
  const result = z.array(templateFieldSchema).safeParse(formSchema);

  if (!result.success) {
    return [];
  }

  return result.data;
}

function fieldToZod(field: TemplateField) {
  if (field.type === "file") {
    return z.undefined().optional();
  }

  const base = z.string().trim();

  if (!field.required) {
    return base.optional().default("");
  }

  return base.min(1, `${field.label} wajib diisi.`);
}

export function buildOrderFormSchema(fields: TemplateField[]) {
  return z.object(
    Object.fromEntries(fields.map((field) => [field.name, fieldToZod(field)]))
  );
}

export function validateTotalUploadSize(files: Array<{ size_bytes: number }>) {
  const total = files.reduce((sum, file) => sum + file.size_bytes, 0);
  return total <= MAX_TOTAL_UPLOAD_BYTES;
}

export type UploadCandidate = {
  field_name: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
};

export function validateOrderUploads(fields: TemplateField[], uploads: UploadCandidate[]) {
  const fileFields = fields.filter((field) => field.type === "file");
  const fileFieldNames = new Set(fileFields.map((field) => field.name));

  for (const upload of uploads) {
    if (!fileFieldNames.has(upload.field_name)) {
      throw new Error(`Upload ${upload.field_name} tidak dikenal.`);
    }

    if (upload.size_bytes > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File ${upload.filename} melebihi batas 5MB.`);
    }

    if (!ALLOWED_UPLOAD_MIME_TYPES.includes(upload.mime_type as never)) {
      throw new Error(`Tipe file ${upload.mime_type} belum didukung.`);
    }
  }

  if (!validateTotalUploadSize(uploads)) {
    throw new Error("Total upload melebihi batas 20MB.");
  }

  for (const field of fileFields) {
    if (field.required && !uploads.some((upload) => upload.field_name === field.name)) {
      throw new Error(`${field.label} wajib diupload.`);
    }
  }
}
