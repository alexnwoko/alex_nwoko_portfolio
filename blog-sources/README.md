# Blog Sources

Source files for every blog post on **alexnwoko.com/blog**. This folder is the
canonical home for content drafts, research notes, and original documents that
become published posts.

---

## Governance Model

The **single source of truth for what is publicly visible** on the website is:

```
src/lib/blog-posts-meta.ts
```

Each post entry has a `published` flag that controls visibility:

| `published` value | Effect on the live site |
|---|---|
| `true` | Visible on `/blog`, listed in `sitemap.xml`, indexed by Google |
| `false` | Hidden from `/blog`, excluded from `sitemap.xml`, not crawlable |
| _(omitted)_ | Treated as `true` (default) |

The source file in this folder stays put regardless of `published` status.
That gives us a clean separation between **content existence** (this folder)
and **publication state** (the metadata flag).

---

## Lifecycle Operations

**To publish a draft.** Add the source file here, write the page body in
`src/app/blog/[slug]/page.tsx`, add an entry to `blog-posts-meta.ts` with
`published: true`. Build, deploy.

**To pause / withdraw a published post.** Set `published: false` in
`blog-posts-meta.ts`. The post disappears from `/blog` and the sitemap. The
page itself remains accessible at the direct URL (so existing links don't
break entirely), and the source file in this folder is untouched. The post
can be re-published instantly by flipping the flag back.

**To re-publish a paused post.** Flip `published: false` → `true`. No
content rewrite needed.

**To permanently retire a post.** Move the source file into a `retired/`
subfolder here, remove the entry from `blog-posts-meta.ts`, and delete the
slug-keyed entry from the `blogPosts` object in `[slug]/page.tsx`. Keep the
file for the historical record; deleting it loses the original draft forever.

---

## File Conventions

- **Filename = slug + extension.** Example: `disaster-loss-data-climate-adaptation.md`
- **Extensions accepted:** `.md`, `.docx`, `.txt`. Use `.md` for posts written
  natively in markdown; `.docx` for posts that started life as Word documents
  with formatting; `.txt` for raw research notes.
- **Always preserve the original source** even after publication. Future edits
  start from the canonical version, not from a re-extraction of the rendered
  page.

---

## Why This Matters

Treating the website as the only artefact is fragile. If the page content
diverges from the original draft (which often happens during editing), the
"true" version of the post lives nowhere recoverable. By keeping every source
here, we:

1. **Govern visibility** through a single boolean flag rather than by deleting
   content.
2. **Preserve provenance** — every post can be traced back to a source file.
3. **Make withdrawal reversible** — if a post needs to be pulled urgently,
   no content is destroyed.
4. **Enable future re-use** — the same source can be repurposed (LinkedIn
   article, conference paper, newsletter) without re-extracting from HTML.
