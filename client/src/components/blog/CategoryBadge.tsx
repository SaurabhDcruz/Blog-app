import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CategoryColor = {
  bg: string;
  text: string;
  hover: string;
};

const CATEGORY_COLORS: Record<string, CategoryColor> = {
  technology: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    hover: "hover:bg-blue-200",
  },
  lifestyle: {
    bg: "bg-green-100",
    text: "text-green-800",
    hover: "hover:bg-green-200",
  },
  business: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    hover: "hover:bg-amber-200",
  },
  culture: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    hover: "hover:bg-purple-200",
  },
  default: {
    bg: "bg-slate-100",
    text: "text-slate-800",
    hover: "hover:bg-slate-200",
  },
};

interface CategoryBadgeProps {
  categorySlug: string;
  name: string;
  className?: string;
}

export default function CategoryBadge({ categorySlug, name, className }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[categorySlug] || CATEGORY_COLORS.default;
  
  return (
    <Link href={`/category/${categorySlug}`}>
      <Badge
        className={cn(
          "font-medium cursor-pointer transition-colors duration-200",
          colors.bg,
          colors.text,
          colors.hover,
          "dark:bg-opacity-20 dark:hover:bg-opacity-30",
          className
        )}
        variant="outline"
      >
        {name}
      </Badge>
    </Link>
  );
}
