# 293 Piney Bluff

Operations and systems reference for the farm.

## What this is

A two-layer documentation site for the property at 293 Piney Bluff, Boykin, SC.

- **Public layer** (this repository): system-organized and map-organized index of every documented infrastructure point on the property, linking to walkthrough videos.
- **Private layer** (separate, on the home Pi): wills, accounts, financial records, animal records. Login-protected.

## How the public layer works

The visible site is built from three template files (`index.html`, `style.css`, `app.js`) plus one content file (`content.yaml`). The templates render whatever is in the YAML.

- To add or change content: edit `content.yaml`. The site rebuilds itself within ~2 minutes.
- To change the site's appearance or behavior: edit the template files. (Rare.)

For day-to-day editing, see `MAINTENANCE.md`.

## File layout

```
293pineybluff/
├── index.html           Page structure
├── style.css            Visual design
├── app.js               Reads content.yaml, renders the page
├── content.yaml         All site content — this is the file you edit
├── assets/
│   └── property.jpg     Aerial satellite image of the property
├── README.md            This file
└── MAINTENANCE.md       Plain-language editing guide for whoever maintains the site
```

## Hosting

- **Domain registration:** Namecheap
- **DNS + CDN:** Cloudflare (zone: 293pineybluff.com)
- **Hosting:** Cloudflare Pages, connected to this GitHub repository
- **Email forwarding:** Namecheap (MX/SPF preserved on Cloudflare)

Changes pushed to the `main` branch on GitHub deploy automatically to the live site.

## Maintenance

If you are reading this and need to update the site, see `MAINTENANCE.md`.
That file is written for non-technical readers.
