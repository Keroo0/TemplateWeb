import { z } from "zod";

import {
  buildOrderFormSchema,
  parseTemplateFields,
  validateOrderUploads,
  type UploadCandidate
} from "@/lib/form-schema";
import { generateOrderCode } from "@/lib/order-code";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CatalogTemplate } from "@/lib/templates";
import type { Json } from "@/lib/supabase/database.types";

export const createOrderInputSchema = z.object({
  template_slug: z.string().min(1),
  customer_name: z.string().trim().min(1),
  customer_email: z.string().trim().email(),
  customer_whatsapp: z.string().trim().optional().default(""),
  notes_customer: z.string().trim().optional().default(""),
  form_data: z.record(z.string(), z.unknown())
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

export type OrderUpload = UploadCandidate & {
  file: Blob;
};

function safeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export async function createPendingOrder(
  template: CatalogTemplate,
  input: CreateOrderInput,
  uploads: OrderUpload[] = []
): Promise<{ id: string; order_code: string }> {
  const fields = parseTemplateFields(template.form_schema);
  validateOrderUploads(fields, uploads);
  const formSchema = buildOrderFormSchema(fields);
  const formData = formSchema.parse(input.form_data);
  const supabase = createSupabaseAdminClient();
  const orderCode = generateOrderCode();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      template_id: template.id,
      order_code: orderCode,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_whatsapp: input.customer_whatsapp || null,
      status: "pending_payment",
      form_data: formData as Json,
      amount_idr: template.price_idr,
      delivery_type: template.delivery_type,
      notes_customer: input.notes_customer || null
    })
    .select("id, order_code")
    .single();

  if (error) {
    throw new Error(`Gagal membuat pesanan: ${error.message}`);
  }

  const uploadedObjects: string[] = [];

  try {
    for (const upload of uploads) {
      const objectPath = `${orderCode}/${upload.field_name}-${safeFilename(upload.filename)}`;
      const { error: uploadError } = await supabase.storage
        .from("customer-uploads")
        .upload(objectPath, await upload.file.arrayBuffer(), {
          contentType: upload.mime_type,
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Gagal upload ${upload.filename}: ${uploadError.message}`);
      }

      uploadedObjects.push(objectPath);

      const { error: assetError } = await supabase.from("order_assets").insert({
        order_id: data.id,
        kind: "customer_upload",
        field_name: upload.field_name,
        bucket_id: "customer-uploads",
        object_path: objectPath,
        original_filename: upload.filename,
        mime_type: upload.mime_type,
        size_bytes: upload.size_bytes
      });

      if (assetError) {
        throw new Error(`Gagal menyimpan metadata upload: ${assetError.message}`);
      }
    }
  } catch (uploadError) {
    if (uploadedObjects.length > 0) {
      await supabase.storage.from("customer-uploads").remove(uploadedObjects);
    }

    await supabase.from("orders").delete().eq("id", data.id);
    throw uploadError;
  }

  return data;
}
