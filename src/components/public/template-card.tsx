import { ArrowRight, Clock3, Download, Globe2 } from "lucide-react";
import Link from "next/link";

import type { CatalogTemplate } from "@/lib/templates";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatPrice(price_idr: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price_idr);
}

export function TemplateCard({ template }: { template: CatalogTemplate }) {
  const DeliveryIcon = template.delivery_type === "hosted" ? Globe2 : Download;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">{template.category.name}</Badge>
          <DeliveryIcon className="h-4 w-4 text-primary" />
        </div>
        <CardTitle className="pt-3">{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-2xl font-semibold">{formatPrice(template.price_idr)}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4" />
          {template.estimated_days_min}-{template.estimated_days_max} hari pengerjaan
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Delivery: {template.delivery_type === "hosted" ? "link hosted" : "zip download"}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/templates/${template.slug}`}
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Pilih template
          <ArrowRight />
        </Link>
      </CardFooter>
    </Card>
  );
}
