"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = query.trim();
    router.push(nextQuery ? `/buscar?q=${encodeURIComponent(nextQuery)}` : "/buscar");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-3 py-2 shadow-sm"
    >
      <Search className="h-4 w-4 text-[color:var(--muted-foreground)]" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar noticias"
        className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--muted-foreground)]"
      />
    </form>
  );
}
