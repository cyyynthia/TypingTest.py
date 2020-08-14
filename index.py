import json
import os
import asyncio

from quart import Quart, render_template, send_from_directory, abort

with open("config.json", "r") as f:
    config = json.load(f)

app = Quart(__name__)
app.config.update(
    DEBUG=config["debug"],
    PROPAGATE_EXCEPTIONS=False
)


# Fetch all languages to cache
all_languages = []
for g in os.listdir("languages"):
    with open(f"languages/{g}") as f:
        lang_temp = json.load(f)
        all_languages.append({
            "author": lang_temp["_author"], "emoji": lang_temp["emoji"],
            "language": lang_temp["language"], "language_url": g[:-5]
        })


def render_words(language: str = "en-us"):
    try:
        with open(f"languages/{language}.json") as f:
            all_words = json.load(f)
    except Exception:
        abort(404, "Language not found...")

    return all_words


@app.route("/")
async def index_home():
    lang = render_words()
    return await render_template(
        "index.html", words=lang["words"], emoji=lang["emoji"]
    )


@app.route("/languages")
async def index_select_language():
    return await render_template(
        "languages.html", languages=all_languages
    )


@app.route("/languages/<language>")
async def index_home_lang(language: str):
    lang = render_words(language=language)
    return await render_template(
        "index.html", words=lang["words"], emoji=lang["emoji"]
    )


@app.route("/assets/<path:path>")
async def send_assets(path):
    return await send_from_directory("templates/assets", path)


loop = asyncio.get_event_loop()
app.run(port=config["port"], loop=loop)
