# How to maintain 293pineybluff.com

A guide for Shannon, Madeleine, and anyone else who needs to update the site.

This is not a technical document. You don't need to know any code. You only
need to know how to log into a website and edit a text file. If you can do
that, you can keep this site working forever.

---

## What this site is

293pineybluff.com is a guide to how the farm works. It lists every system
(electrical, water, propane, etc.), every building, every well, and every
piece of infrastructure that someone might need to find or operate. Most
listings have a QR code on the property that links to a video walkthrough.

The site is maintained as a set of files on a service called **GitHub**.
GitHub is online file storage with one special feature: every change is
saved permanently and can be undone. You will never permanently break
anything. If you make a mistake, you can roll back to a previous version
in one click.

When you save a change on GitHub, the live site at 293pineybluff.com
rebuilds itself within about 2 minutes.

---

## The only file you'll usually edit

The file is called **content.yaml**.

Everything visible on the site comes from this file: the building names,
the descriptions, the walkthrough titles, the QR locations, the videos.

You don't need to know what "YAML" means. The file is plain text with a
specific shape. Every section follows the same pattern.

---

## How to make a change

1. Go to **github.com** and sign in. (If you don't know the password, check
   the password vault. The login is associated with the email address on file.)

2. Click on the repository called **293pineybluff**.

3. Click on the file **content.yaml**.

4. Click the **pencil icon** at the top right of the file (or press `e`).

5. Make your change. (See the patterns below.)

6. At the bottom of the page, type a short description of what you changed,
   like *"Updated water heater walkthrough video URL"* — this is your note
   to your future self.

7. Click **Commit changes**.

8. Wait about 2 minutes, then refresh 293pineybluff.com to see the change.

That's it.

---

## Common changes — patterns to copy

Every walkthrough in `content.yaml` looks like this:

```yaml
      - title: "Main breaker panel"
        location: "Utility room, north wall behind door"
        system: electrical
        video: ""
        description: "Locating the main panel and identifying labeled circuits."
```

Five fields. Always the same shape. The indentation matters — keep the
spacing the same as the surrounding entries.

### To add a video URL after filming a walkthrough

Find the walkthrough. Replace the empty quotes after `video:` with the URL.

Before:
```yaml
        video: ""
```

After:
```yaml
        video: "https://youtu.be/abc123xyz"
```

### To fix a typo

Find the text. Edit it. Save.

### To add a new walkthrough

Find the location it belongs to (e.g., the House). Find the existing
walkthroughs under it. Copy one entry, paste it underneath, change the
words. Make sure the indentation matches.

### To remove a walkthrough

Find the entry. Delete those five lines (title, location, system, video,
description). Save.

### To change a building's description

Find the building. Edit the `description:` line. Keep the quotes.

---

## The rules of the file

These are the only rules that matter:

1. **Indentation matters.** Each level uses 2 spaces. NEVER tabs. If you
   copy an existing entry as a template, you'll get the indentation right
   automatically.

2. **Keep the quotes.** Anything that's already in `"quotes"` stays in
   `"quotes"`. If your text contains a quotation mark, replace it with
   a single quote `'` instead, or remove it.

3. **Don't change the field names.** `title`, `location`, `system`,
   `video`, and `description` must stay exactly as written. Only change
   what comes after the colon.

4. **The `system` value must match a system listed at the top of the file.**
   Look at the `systems:` section near the top. Use one of those `id`
   values exactly: `electrical`, `solar`, `climate`, `domestic-water`,
   `livestock-water`, `irrigation`, `network`, `livestock`, `equipment`,
   or `structures`.

---

## If something breaks

If you save a change and the live site stops working or looks wrong:

### Option 1: Roll back (easiest)

1. On GitHub, in the 293pineybluff repository, click **content.yaml**.
2. Click **History** at the top right.
3. You'll see a list of every change ever made, newest first.
4. Click on the version *before* your problem change.
5. Click the three-dot menu (`···`) and choose **Revert**.
6. Confirm.

The site rebuilds with the old version. The bad change is undone.
Nothing is lost.

### Option 2: Fix it forward

If you can see what you broke (usually an indentation problem or a
missing quotation mark), edit `content.yaml` again and fix it.

### Option 3: Ask for help

Take a screenshot of what you see and ask whoever set this up, or ask
Claude (or whatever current AI assistant exists) to look at the file
and tell you what's wrong. The file is small enough that the answer
is usually obvious to a fresh set of eyes.

---

## How the QR codes work

Each walkthrough has a video URL (eventually). The QR code on the property
points to the page on 293pineybluff.com that displays that video.

When a video URL is added to a walkthrough, the QR code starts working.
Until then, the page shows "video coming soon."

Generating new QR codes for new walkthroughs is a one-time task done at
filming time. See the separate document on QR generation for that.

---

## Replacing the satellite map image

The aerial photo of the property is `assets/property.jpg`.

To replace it (for example, with a fresh drone shot):

1. On GitHub, navigate to the `assets` folder.
2. Click `property.jpg`.
3. Click the trash icon to delete it.
4. Go back to the `assets` folder.
5. Click **Add file** → **Upload files**.
6. Upload your new image, named exactly `property.jpg`.

The new image will appear on the site within ~2 minutes.

**Important:** the pin positions on the map are stored as percentages
(e.g., "33% from the left, 78% from the top"). If your new image is
framed differently from the old one, the pins will land in the wrong
spots. The fix is to open `content.yaml` and adjust the `coordinates: { x: __, y: __ }`
values for each location until the pins line up. Trial and error works.

---

## When you need to make a bigger change

Some things are not edited in `content.yaml`. These include:

- The site's colors, fonts, and layout (in `style.css`)
- The page structure (in `index.html`)
- How the site loads content (in `app.js`)

These changes are rare and require some technical familiarity. If a major
redesign is needed, find someone who builds websites and hand them this
folder. The structure is standard and any web developer will recognize it.

---

## A note from Shawn

This site is meant to outlive me. Everything I built on this property —
the buildings, the wells, the geothermal stack, the cattle, the network —
is here so that whoever inherits the place can operate it without me.

Update the site as the farm changes. Keep the videos current. Add new
walkthroughs as you replace systems. Trust that the architecture is sound;
just fill in what you know.

If you ever feel stuck, remember: nothing here is irreversible. GitHub
keeps every version. Cloudflare rebuilds the site every time you save.
The worst you can do is roll back.

— wsc
