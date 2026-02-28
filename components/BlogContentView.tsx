"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

interface BlogContentViewProps {
    html: string;
}

export function BlogContentView({ html }: BlogContentViewProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;
        const codeBlocks = contentRef.current.querySelectorAll("pre code");
        codeBlocks.forEach((block) => {
            if (!block.getAttribute("data-highlighted")) {
                hljs.highlightElement(block as HTMLElement);
            }
        });

        const pres = contentRef.current.querySelectorAll("pre");
        pres.forEach((pre) => {
            if (pre.querySelector(".copy-code-btn")) return;

            pre.style.position = "relative";

            const currentPaddingTop = window.getComputedStyle(pre).paddingTop;
            if (parseInt(currentPaddingTop) < 36) {
                pre.style.paddingTop = "2.5rem";
            }

            const btn = document.createElement("button");
            btn.className = "copy-code-btn absolute top-13 right-4 p-1.5 rounded-md bg-white/10 hover:bg-white/20 hover:text-white transition-colors cursor-pointer group flex items-center gap-1.5";
            btn.title = "Salin Kode";

            const copyIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
            const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

            btn.innerHTML = `
                <div class="icon-container">${copyIcon}</div>
            `;

            btn.onclick = async () => {
                const codeElement = pre.querySelector("code");
                if (codeElement) {
                    try {
                        await navigator.clipboard.writeText(codeElement.innerText);
                        const iconContainer = btn.querySelector('.icon-container');
                        if (iconContainer) iconContainer.innerHTML = checkIcon;
                        btn.classList.add("text-green-400");

                        setTimeout(() => {
                            if (iconContainer) iconContainer.innerHTML = copyIcon;
                            btn.classList.remove("text-green-400");
                        }, 2000);
                    } catch (err) {
                        console.error("Gagal menyalin kode: ", err);
                    }
                }
            };

            pre.appendChild(btn);
        });
    }, [html]);

    return (
        <div
            ref={contentRef}
            className="tiptap-content prose prose-slate md:prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-headings:mt-10 prose-headings:mb-5
            prose-p:leading-[1.8] prose-p:text-muted-foreground prose-p:mb-7
            prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline-offset-4
            prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-border/50
            prose-strong:text-foreground prose-strong:font-bold
            prose-li:text-muted-foreground prose-ul:marker:text-primary/70 prose-ol:marker:text-primary/70 prose-li:leading-[1.8] prose-li:mb-3
            prose-td:leading-[1.8] prose-td:text-muted-foreground prose-th:text-foreground prose-th:font-bold
            prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-blockquote:border-l-4
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#282c34] prose-pre:text-zinc-50 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:border prose-pre:border-zinc-800
            marker:text-primary w-full break-words"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
