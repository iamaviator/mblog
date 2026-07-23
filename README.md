# Blog & Micro-blog Platform

A personal blog and micro-blog platform built with Next.js 14, React, and Tailwind CSS. File-based content management with admin panel for public access.

## Features

✅ **Full-length blog posts** - Write long-form content in Markdown
✅ **Micro-blog posts** - Share quick thoughts (280 characters)
✅ **Auto-generation** - Automatically create micro-posts from blog posts
✅ **Custom pages** - Create pages like About, Portfolio, etc.
✅ **Admin panel** - Password-protected content management dashboard
✅ **File-based storage** - All content stored as Markdown files (git-friendly)
✅ **Responsive design** - Works on desktop, tablet, and mobile
✅ **Fast & lightweight** - No database, pure static generation

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   - Copy `.env.local` and update if needed
   - Default admin password: `admin123` (change in production!)

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Home: http://localhost:3000
   - Blog: http://localhost:3000/blog
   - Micro-blog: http://localhost:3000/microblog
   - About: http://localhost:3000/about
   - Admin: http://localhost:3000/admin

### Build for production
```bash
npm run build
npm run start
```

## Project Structure

```
mblog/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes (REST endpoints)
│   │   ├── posts/               # Blog post API
│   │   ├── microposts/          # Micro-post API
│   │   ├── pages/               # Custom pages API
│   │   └── admin/               # Admin login endpoint
│   ├── blog/                    # Blog listing page
│   ├── microblog/               # Micro-blog feed page
│   ├── admin/                   # Admin login page
│   ├── [slug]/                  # Dynamic custom pages
│   ├── page.tsx                 # Home page
│   └── layout.tsx               # Root layout
├── content/                      # Content files
│   ├── blog/                    # Blog post markdown files
│   ├── pages/                   # Custom page markdown files
│   └── microposts/              # Micro-post markdown files
├── src/
│   ├── lib/
│   │   ├── content/             # Content file I/O
│   │   │   ├── posts.ts
│   │   │   ├── microposts.ts
│   │   │   └── pages.ts
│   │   ├── utils/               # Utilities
│   │   │   ├── slug.ts
│   │   │   ├── excerpt.ts
│   │   │   ├── markdown.ts
│   │   │   └── auth.ts
│   │   └── types.ts             # TypeScript interfaces
│   └── components/              # React components
├── .env.local                   # Environment variables
├── tsconfig.json
├── next.config.js
└── package.json
```

## Content Format

### Blog Post
Create a file in `content/blog/` as `.md`:

```markdown
---
title: "My Amazing Article"
slug: "my-amazing-article"
date: "2024-07-22"
tags: ["tech", "webdev"]
excerpt: "Short preview of the article"
published: true
---

# My Amazing Article

Your content here...
```

### Micro-post
Create a file in `content/microposts/` as `.md`:

```markdown
---
id: "mp-001"
sourcePostSlug: "my-amazing-article"
date: "2024-07-22"
published: true
---

Short thought (280 chars max)
```

### Custom Page
Create a file in `content/pages/` as `.md`:

```markdown
---
slug: "about"
title: "About Me"
published: true
order: 1
---

Page content...
```

## API Endpoints

### Blog Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/[slug]` - Get single post by slug
- `POST /api/posts` - Create new post (admin)

### Micro-posts
- `GET /api/microposts` - Get all published micro-posts
- `POST /api/microposts` - Create new micro-post (admin)

### Pages
- `GET /api/pages` - Get all published pages
- `GET /api/pages/[slug]` - Get single page by slug
- `POST /api/pages` - Create new page (admin)

### Admin
- `POST /api/admin/login` - Admin login endpoint

## Environment Variables

```env
# Site metadata
NEXT_PUBLIC_SITE_TITLE=My Blog
NEXT_PUBLIC_SITE_DESCRIPTION=Personal blog and micro-blog

# Admin password (for development)
ADMIN_PASSWORD=admin123

# Optional: Use hashed password in production
# ADMIN_PASSWORD_HASH=$2a$10$...
```

## Development Guide

### Adding a Blog Post
1. Create `content/blog/my-post.md`
2. Add frontmatter with title, date, tags, etc.
3. Write content in Markdown
4. Set `published: true`
5. Restart dev server or rebuild

### Adding a Custom Page
1. Create `content/pages/my-page.md`
2. Add frontmatter with slug, title, order
3. Write content
4. Set `published: true`

### Auto-generating Micro-posts
When you publish a blog post, you can manually create a micro-post file in `content/microposts/` with `sourcePostSlug` pointing to your blog post. Future versions will include auto-generation.

### Admin Features (Coming Soon)
- Web-based editor for creating/editing posts
- WYSIWYG markdown editor with preview
- Auto-generation of micro-posts from blog posts
- Content publishing workflow

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Then set environment variables in Vercel dashboard:
- `ADMIN_PASSWORD` - Your admin password

### Other Platforms
- Build: `npm run build`
- Start: `npm run start`
- Ensure `/content` folder is deployed with your app

## Technologies Used

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content Parsing:** gray-matter, remark, remark-html
- **Authentication:** bcryptjs
- **Utilities:** slugify

## Next Steps

### Phase 2-3: Content Management (In Progress)
- [x] File-based content system
- [x] Blog and micro-blog pages
- [ ] Admin web editor
- [ ] Content preview

### Phase 4-5: Admin Panel Features
- [ ] Create/edit/delete posts UI
- [ ] Create/edit/delete pages UI
- [ ] Markdown editor with preview
- [ ] Auto-sync micro-posts

### Phase 6+: Optimization & Extras
- [ ] Search functionality
- [ ] RSS feed generation
- [ ] SEO optimization
- [ ] Category/tag filtering
- [ ] Pagination
- [ ] Code syntax highlighting

## Troubleshooting

**Dev server not starting?**
- Check port 3000 is available
- Clear `.next` folder and rebuild

**Content not showing?**
- Ensure markdown files are in correct folder
- Check `published: true` in frontmatter
- Verify file slug matches URL

**Admin login not working?**
- Check `ADMIN_PASSWORD` in `.env.local`
- Default password is `admin123`

## License

MIT - Feel free to use for personal projects

## Support

For issues or questions, check the documentation in `/docs` or review the component files in `/app`.

---

Built with ❤️ for personal blogging
