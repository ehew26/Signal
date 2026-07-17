"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Records a product view into local signals so recommendations personalize. */
export default function ViewTracker({
  slug,
  category,
  tags,
}: {
  slug: string;
  category: string;
  tags: string[];
}) {
  const { recordView } = useCart();
  useEffect(() => {
    recordView(slug, category, tags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  return null;
}
