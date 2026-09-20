"""Inject content JSON into the HTML pages.

The pages fetch /content/*.json at runtime when served over http(s). When a page
is opened directly from disk (file://) fetch is blocked by the browser, so each
page also carries an embedded snapshot written by this script.

Run:  python tools/build.py
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PAGES = {
    "index.html": ["site", "contact", "about", "products"],
    "about.html": ["site", "contact", "about"],
    "products.html": ["site", "contact", "products"],
    "cases.html": ["site", "contact", "cases", "geo"],
    "honors.html": ["site", "contact", "honors"],
    "contact.html": ["site", "contact"],
}

START = "<!-- build:data -->"
END = "<!-- /build:data -->"


def json_text(value):
    text = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return text.replace("<", "\\u003c")


def read_json(path):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def build_page(name, sources, content_dir, vendor_dir):
    path = os.path.join(ROOT, name)
    with open(path, "r", encoding="utf-8") as handle:
        html = handle.read()
    if START not in html or END not in html:
        raise SystemExit("missing data markers in " + name)

    blocks = []
    for key in sources:
        if key == "geo":
            data = read_json(os.path.join(vendor_dir, "china-geo.json"))
            blocks.append(
                '<script type="application/json" id="geo-data">%s</script>' % json_text(data)
            )
            continue
        data = read_json(os.path.join(content_dir, key + ".json"))
        blocks.append(
            '<script type="application/json" id="page-data-%s">%s</script>'
            % (key, json_text(data))
        )

    replacement = START + "\n" + "\n".join(blocks) + "\n" + END
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.S)
    html = pattern.sub(lambda _m: replacement, html, count=1)
    with open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(html)
    return len(replacement)


def main():
    content_dir = os.path.join(ROOT, "content")
    vendor_dir = os.path.join(ROOT, "assets", "vendor")
    total = 0
    for name, sources in PAGES.items():
        total += build_page(name, sources, content_dir, vendor_dir)
        print("built", name)
    print("done, embedded bytes:", total)


if __name__ == "__main__":
    main()
