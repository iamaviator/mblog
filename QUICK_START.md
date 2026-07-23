# Quick Start Guide

## 🚀 Access Your Blog

**Local Development**: http://localhost:3000
**Admin Panel**: http://localhost:3000/admin
**Default Password**: `admin123`

---

## 📋 Main Features

### Public Site
| Page | URL | What It Shows |
|------|-----|--------------|
| Home | `/` | Latest posts and micro-posts |
| Blog | `/blog` | All published blog posts |
| Post | `/blog/[slug]` | Individual post full content |
| Micro-blog | `/microblog` | All published micro-posts |
| Pages | `/about` | Custom pages (dynamic) |

### Admin Panel
| Section | URL | What You Can Do |
|---------|-----|-----------------|
| Login | `/admin` | Enter your password |
| Dashboard | `/admin/dashboard` | Overview of content |
| Posts | `/admin/dashboard/posts` | View, create, edit, delete posts |
| Pages | `/admin/dashboard/pages` | View, create, edit, delete pages |
| Microposts | `/admin/dashboard/microposts` | View, create, edit, delete microposts |

---

## ✨ Complete Workflows

### Creating a Blog Post

1. Go to `/admin` and login
2. Click "Manage Blog Posts"
3. Click "Create New Post"
4. Fill in the form:
   - **Title**: Post title
   - **Slug**: URL path (auto-generated)
   - **Date**: Publication date
   - **Tags**: Comma-separated tags
   - **Excerpt**: Short summary
   - **Content**: Full post in Markdown
   - **Published**: Toggle to make public
5. Click "Save"
6. View on site at `/blog/[slug]`

### Editing a Blog Post

1. Go to `/admin/dashboard/posts`
2. Find your post in the list
3. Click "Edit"
4. Modify any field
5. Click "Save Changes"
6. Changes immediately saved

### Deleting a Blog Post

1. Go to `/admin/dashboard/posts`
2. Find your post
3. Click "Edit"
4. Click "Delete" button
5. Confirm deletion
6. Post marked as unpublished (hidden from public)

### Creating a Custom Page

1. Go to `/admin/dashboard/pages`
2. Click "Create New Page"
3. Fill in:
   - **Title**: Page title
   - **Slug**: URL path
   - **Content**: Page content in Markdown
   - **Order**: Navigation order
   - **Published**: Toggle to make public
4. Save
5. View at `/[slug]`

### Creating a Micro-post

1. Go to `/admin/dashboard/microposts`
2. Click "Create New Micro-post"
3. Fill in:
   - **Date**: Post date
   - **Content**: Max 280 characters
   - **Published**: Toggle to make public
4. Save
5. View on `/microblog` feed

---

## 🔐 Authentication

### Login
```
URL: http://localhost:3000/admin
Password: admin123 (default)
```

### Logout
Click logout in admin panel to clear session

### Change Password
Edit `.env.local`:
```
ADMIN_PASSWORD=your_new_password
```

Or for production (hashed):
```bash
node -e "require('bcryptjs').hash('your_password', 10).then(console.log)"
```

Then add to `.env.local`:
```
ADMIN_PASSWORD_HASH=<hash_from_above>
```

---

## 📁 Content Storage

All content is stored in the `content/` folder:

```
content/
├── blog/              # Blog posts
│   ├── welcome.md     # Sample post
│   └── your-post.md
├── pages/             # Custom pages
│   ├── about.md
│   └── your-page.md
└── microposts/        # Micro-posts
    └── mp-1234.md
```

Each file is Markdown with YAML frontmatter:

```markdown
---
title: "Post Title"
slug: "post-slug"
date: "2024-01-15"
tags: ["tag1", "tag2"]
excerpt: "Short summary"
published: true
---

# Post Title

Your content here in Markdown...
```

---

## 🌍 API Endpoints

### Public (No Auth)
- `GET /api/posts` - All published posts
- `GET /api/posts/[slug]` - Single published post
- `GET /api/pages` - All published pages
- `GET /api/pages/[slug]` - Single published page
- `GET /api/microposts` - All published microposts

### Admin (Auth Required)
- `POST /api/admin/login` - Login (returns cookie)
- `GET /api/admin/check` - Verify auth status
- `POST /api/admin/logout` - Clear session

### Data (Auth Aware)
- `GET /api/posts` (admin) - All posts including drafts
- `GET /api/posts/[slug]` (admin) - Can view drafts
- `POST /api/posts` - Create/Update posts
- `GET /api/pages` (admin) - All pages including drafts
- `GET /api/pages/[slug]` (admin) - Can view drafts
- `POST /api/pages` - Create/Update pages
- `GET /api/microposts` (admin) - All including drafts
- `POST /api/microposts` - Create/Update microposts

---

## 🎨 Customization

### Change Site Title
Edit `.env.local`:
```
NEXT_PUBLIC_SITE_TITLE=My Amazing Blog
```

### Customize Colors
Edit `src/styles/globals.css` or modify Tailwind config

### Update Homepage
Edit `app/page.tsx` to customize layout

### Add Navigation Items
Edit `app/app/layout.tsx` to add menu items

---

## 🚢 Deploy to Production

### Vercel (Recommended)
1. Push code to GitHub
2. Import repo in Vercel
3. Set `ADMIN_PASSWORD` in environment variables
4. Deploy!

### Other Platforms
- Requires Node.js runtime
- Set `ADMIN_PASSWORD` in environment
- Ensure `content/` folder is writable
- Deploy with `npm run build && npm start`

---

## ✅ Feature Checklist

- [x] Create blog posts
- [x] Edit blog posts ✨
- [x] Delete blog posts ✨
- [x] Create custom pages
- [x] Edit custom pages ✨
- [x] Delete custom pages ✨
- [x] Create micro-posts
- [x] Edit micro-posts ✨
- [x] Delete micro-posts ✨
- [x] Admin authentication
- [x] Public/draft toggle
- [x] Markdown support
- [x] Responsive design
- [x] File-based storage
- [x] REST API
- [x] Server-side auth

---

## 🆘 Troubleshooting

### Can't login
- Check password in `.env.local`
- Default is `admin123`
- Restart dev server after changing password

### Can't see draft posts
- Make sure logged in (check `/api/admin/check`)
- Try refreshing page
- Check browser console for errors

### Edit page not loading
- Verify you're logged in
- Check that content item exists
- Try creating a new item first

### Content not saving
- Check `content/` folder permissions
- Ensure disk has space
- Check console for error messages

---

## 📚 Additional Resources

- `FEATURES_COMPLETE.md` - Full feature list
- `FIXES_IMPLEMENTED.md` - Technical changes made
- `README.md` - Project overview
- `.env.local` - Configuration file

---

## 💡 Tips & Tricks

### Markdown Quick Reference
```
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`inline code`

\`\`\`javascript
// Code block
console.log('Hello');
\`\`\`

- List item
- Another item

1. Numbered
2. List

[Link text](url)
![Image alt](image-url)
```

### Use Drafts
- Toggle "Published" OFF to save as draft
- Only visible in admin panel
- Use this to write and schedule posts

### Organize Posts
- Use tags to categorize
- Set slug for SEO-friendly URLs
- Use dates to control order

### Page Order
- Set "Order" number for custom pages
- Lower numbers appear first in navigation

---

**Your blog is ready to go! Start creating content now.** 🎉
