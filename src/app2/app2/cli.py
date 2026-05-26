import typer

from app2.bulk import patch_cmd
from app2.release import release, release_all
from app2.validate import validate

app = typer.Typer(
    help="OpenNebula marketplace appliance management.",
    no_args_is_help=True,
    add_completion=False,
    rich_markup_mode=None,
    pretty_exceptions_enable=False,
)

app.command()(release)
app.command(name="release-all")(release_all)
app.command(name="patch")(patch_cmd)
app.command(name="validate")(validate)
