import Link from "next/link";
import { MapPin, Phone, Star, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Dentist } from "@/lib/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-sm text-amber-500">
      <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-500" />
      <span className="font-medium">{rating.toFixed(1)}</span>
    </span>
  );
}

export function DentistCard({ dentist }: { dentist: Dentist }) {
  return (
    <Link href={`/dentiste/${dentist.slug}`} className="group block h-full">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        {dentist.photo_url && (
          <div className="h-40 w-full overflow-hidden rounded-t-xl bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dentist.photo_url}
              alt={dentist.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
              {dentist.name}
            </h3>
            {dentist.verified && (
              <Badge className="shrink-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Vérifié
              </Badge>
            )}
          </div>
          {dentist.rating && <StarRating rating={dentist.rating} />}
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pb-4">
          {(dentist.neighborhood || dentist.city) && (
            <p className="flex items-center gap-1.5 text-sm text-zinc-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {[dentist.neighborhood, dentist.city].filter(Boolean).join(" · ")}
            </p>
          )}
          {dentist.phone && (
            <p className="flex items-center gap-1.5 text-sm text-zinc-500">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {dentist.phone}
            </p>
          )}
          {dentist.specialties && dentist.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {dentist.specialties.slice(0, 3).map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
              {dentist.specialties.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{dentist.specialties.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
