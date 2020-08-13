import json
import asyncio

from quart import Quart, render_template, send_from_directory, abort

with open("config.json", "r") as f:
    config = json.load(f)

app = Quart(__name__)
app.config.update(
    DEBUG=config["debug"],
    PROPAGATE_EXCEPTIONS=False
)


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


@app.route("/assets/<path:path>")
async def send_assets(path):
    return await send_from_directory("templates/assets", path)


loop = asyncio.get_event_loop()
app.run(port=config["port"], loop=loop)
