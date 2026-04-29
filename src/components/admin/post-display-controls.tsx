"use client";

import { useFormStatus } from "react-dom";

import { updatePostDisplayAction } from "@/lib/actions";

type PostDisplayControlsProps = {
  id: string;
  homeOrder: number;
  isMain: boolean;
};

function SaveOrderButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-[color:var(--line)] px-3 py-2 text-xs font-semibold text-[color:var(--lake-blue)] disabled:opacity-60"
    >
      {pending ? "Guardando..." : "Guardar"}
    </button>
  );
}

function MainButton({ isMain }: { isMain: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-full px-3 py-2 text-xs font-semibold disabled:opacity-60 ${
        isMain
          ? "bg-[color:var(--lake-blue)] text-white"
          : "border border-[color:var(--line)] text-[color:var(--lake-blue)]"
      }`}
    >
      {pending ? "Actualizando..." : isMain ? "Principal actual" : "Hacer principal"}
    </button>
  );
}

export function PostDisplayControls({ id, homeOrder, isMain }: PostDisplayControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <form action={updatePostDisplayAction} className="flex items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <input
          type="number"
          name="homeOrder"
          defaultValue={homeOrder}
          min={0}
          className="w-20 rounded-xl border border-[color:var(--line)] px-3 py-2"
        />
        <SaveOrderButton />
      </form>

      <form action={updatePostDisplayAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="homeOrder" value={homeOrder} />
        <input type="hidden" name="makeMain" value="true" />
        <MainButton isMain={isMain} />
      </form>
    </div>
  );
}
