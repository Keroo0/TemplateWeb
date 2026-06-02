import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/database.types";

type TemplateRow = Database["public"]["Tables"]["templates"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

type TemplateCategory = Pick<
  CategoryRow,
  "slug" | "name" | "description" | "delivery_type"
>;

type SelectedTemplateRow = Pick<
  TemplateRow,
  | "id"
  | "slug"
  | "name"
  | "description"
  | "price_idr"
  | "estimated_days_min"
  | "estimated_days_max"
  | "preview_image_path"
  | "form_schema"
  | "is_active"
  | "sort_order"
>;

type TemplateWithCategoryRow = SelectedTemplateRow & {
  categories: TemplateCategory | null;
};

export type CatalogTemplate = Pick<
  TemplateRow,
  | "id"
  | "slug"
  | "name"
  | "description"
  | "price_idr"
  | "estimated_days_min"
  | "estimated_days_max"
  | "preview_image_path"
  | "form_schema"
> & {
  category: TemplateCategory;
  delivery_type: TemplateCategory["delivery_type"];
};

function mapTemplate(row: TemplateWithCategoryRow): CatalogTemplate {
  if (!row.categories) {
    throw new Error(`Template ${row.slug} tidak punya kategori aktif.`);
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price_idr: row.price_idr,
    estimated_days_min: row.estimated_days_min,
    estimated_days_max: row.estimated_days_max,
    preview_image_path: row.preview_image_path,
    form_schema: row.form_schema as Json,
    category: row.categories,
    delivery_type: row.categories.delivery_type
  };
}

export async function getCatalogTemplates() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("templates")
    .select(
      `
        id,
        slug,
        name,
        description,
        price_idr,
        estimated_days_min,
        estimated_days_max,
        preview_image_path,
        form_schema,
        is_active,
        sort_order,
        categories!inner (
          slug,
          name,
          description,
          delivery_type,
          is_active
        )
      `
    )
    .eq("is_active", true)
    .eq("categories.is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Gagal mengambil katalog template: ${error.message}`);
  }

  return ((data ?? []) as unknown as TemplateWithCategoryRow[]).map(mapTemplate);
}

export async function getTemplateBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("templates")
    .select(
      `
        id,
        slug,
        name,
        description,
        price_idr,
        estimated_days_min,
        estimated_days_max,
        preview_image_path,
        form_schema,
        is_active,
        sort_order,
        categories!inner (
          slug,
          name,
          description,
          delivery_type,
          is_active
        )
      `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("categories.is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil detail template: ${error.message}`);
  }

  return data ? mapTemplate(data as unknown as TemplateWithCategoryRow) : null;
}
