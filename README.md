# chprc-county-stats
This repo leverages a rawgit cdn url that is referenced by an iframe in a wordpress site.

It also leverages a google sheet as it's database.

These decisions were made to remove hosting costs without changing anyones workflows.

## Quickstart
The iframe is pointing to `public/index.html` so you will only need to edit that file.
Other files in this repo are the components that would get compiled together should you
choose to edit them instead of the`public/index.html` directly.

Thus all of these just mentioned other files will be ignored except `public/index.html`.

But *please* manually copy/paste changes from `public/index.html` to their associated component files to keep everything in sync.

## Dev workflow
Simply execute the following command into your terminal or navigate to the file on
your browser to load the `public/index.html` page. This would use the "file://" protocol and
look something like this `file://users/Users/{your-username}/{path-to-local-directory}/chprc-county-stats/public/index.html`

```
open ./public/index.html
```

The wordpress site includes Bootstrap styles so don't worry if loading the page looks like it
is missing some styles.
