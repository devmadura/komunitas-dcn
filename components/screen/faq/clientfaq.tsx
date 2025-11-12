"use client";

import { useState } from "react";

type FAQ = { id: string; q: string; a: string };

export default function FAQClient({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 sticky top-24 self-start md:bg-background/80 backdrop-blur-2xl shadow-lg">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-3">Daftar Isi</h2>
          <ul className="space-y-2 text-sm">
            {faqs.map((f) => (
              <li key={f.id}>
                <a
                  href={`#${f.id}`}
                  onClick={() => setOpenId(f.id)}
                  className="text-sky-600 hover:underline"
                >
                  {f.q}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="md:col-span-3 space-y-4">
        {faqs.map((f) => {
          const open = openId === f.id;
          return (
            <article
              id={f.id}
              key={f.id}
              className="border rounded-lg"
              aria-labelledby={`${f.id}-title`}
            >
              <button
                id={`${f.id}-title`}
                aria-expanded={open}
                aria-controls={`${f.id}-content`}
                onClick={() => setOpenId(open ? null : f.id)}
                className="w-full flex items-center justify-between p-5"
              >
                <h3 className="text-lg font-medium text-left">{f.q}</h3>
                <svg
                  className={`h-5 w-5 transform transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                id={`${f.id}-content`}
                role="region"
                aria-labelledby={`${f.id}-title`}
                className={`px-5 pb-5 transition-[max-height,opacity] duration-200 overflow-hidden ${
                  open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-neutral-500 whitespace-pre-line">{f.a}</p>
              </div>
            </article>
          );
        })}

        <div className="text-sm text-neutral-400 mt-4">
          <p>
            Tidak menemukan jawaban? email di :{" "}
            <span className="text-sky-600">
              <a href="mailto:info@dcnunira.dev">info@dcnunira.dev</a>
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
