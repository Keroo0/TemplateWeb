"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { parseTemplateFields, type TemplateField } from "@/lib/form-schema";
import type { CatalogTemplate } from "@/lib/templates";

type OrderFormValues = {
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  notes_customer: string;
  form_data: Record<string, string>;
};

export function OrderForm({ template }: { template: CatalogTemplate }) {
  const fields = useMemo(
    () => parseTemplateFields(template.form_schema),
    [template.form_schema]
  );
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<OrderFormValues>({
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_whatsapp: "",
      notes_customer: "",
      form_data: {}
    }
  });

  async function onSubmit(values: OrderFormValues) {
    setMessage(null);

    const payload = {
        template_slug: template.slug,
        ...values
      };
    const requestBody = new FormData();
    requestBody.append("payload", JSON.stringify(payload));

    for (const [fieldName, file] of Object.entries(selectedFiles)) {
      if (file) {
        requestBody.append(`file:${fieldName}`, file);
      }
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      body: requestBody
    });

    const result = (await response.json()) as {
      order?: { order_code: string };
      error?: string;
    };

    if (!response.ok) {
      setMessage(result.error ?? "Pesanan belum bisa dibuat.");
      return;
    }

    setMessage(`Pesanan dibuat: ${result.order?.order_code}. Lanjut pembayaran di Phase 7.`);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama customer">
          <input className="w-full border border-border bg-background px-3 py-2" {...register("customer_name", { required: true })} />
        </Field>
        <Field label="Email">
          <input className="w-full border border-border bg-background px-3 py-2" type="email" {...register("customer_email", { required: true })} />
        </Field>
        <Field label="WhatsApp">
          <input className="w-full border border-border bg-background px-3 py-2" {...register("customer_whatsapp")} />
        </Field>
        <Field label="Catatan">
          <input className="w-full border border-border bg-background px-3 py-2" {...register("notes_customer")} />
        </Field>
      </div>

      <div className="grid gap-4">
        {fields.map((field) => (
          <DynamicField
            key={field.name}
            field={field}
            register={register}
            onFileChange={(file) =>
              setSelectedFiles((current) => ({
                ...current,
                [field.name]: file
              }))
            }
          />
        ))}
      </div>

      {message ? (
        <p className="border border-border bg-muted p-3 text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Membuat pesanan..." : "Pesan sekarang"}
      </Button>
    </form>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function DynamicField({
  field,
  register,
  onFileChange
}: {
  field: TemplateField;
  register: ReturnType<typeof useForm<OrderFormValues>>["register"];
  onFileChange: (file: File | null) => void;
}) {
  const registerName = `form_data.${field.name}` as const;

  if (field.type === "file") {
    return (
      <Field label={field.label}>
        <input
          className="w-full border border-border bg-background px-3 py-2"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          required={field.required}
        />
      </Field>
    );
  }

  if (field.type === "textarea") {
    return (
      <Field label={field.label}>
        <textarea
          className="min-h-28 w-full border border-border bg-background px-3 py-2"
          {...register(registerName, { required: field.required })}
        />
      </Field>
    );
  }

  return (
    <Field label={field.label}>
      <input
        className="w-full border border-border bg-background px-3 py-2"
        type={field.type === "date" ? "date" : "text"}
        {...register(registerName, { required: field.required })}
      />
    </Field>
  );
}
