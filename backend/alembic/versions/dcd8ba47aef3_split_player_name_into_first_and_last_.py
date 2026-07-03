"""split player name into first and last name

Revision ID: dcd8ba47aef3
Revises: ca7ce864ea68
Create Date: 2026-07-02 14:02:43.157441

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dcd8ba47aef3'
down_revision: Union[str, Sequence[str], None] = 'ca7ce864ea68'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Step 1: add the new columns as nullable first (so existing rows don't break)
    op.add_column('players', sa.Column('first_name', sa.String(), nullable=True))
    op.add_column('players', sa.Column('last_name', sa.String(), nullable=True))

    # Step 2: split existing 'name' data into first_name / last_name
    connection = op.get_bind()
    players = connection.execute(sa.text("SELECT id, name FROM players")).fetchall()

    for player in players:
        parts = player.name.strip().split(" ", 1)
        first = parts[0]
        last = parts[1] if len(parts) > 1 else ""
        connection.execute(
            sa.text("UPDATE players SET first_name = :first, last_name = :last WHERE id = :id"),
            {"first": first, "last": last, "id": player.id}
        )

    # Step 3: now that every row has a value, make the columns required
    op.alter_column('players', 'first_name', nullable=False)
    op.alter_column('players', 'last_name', nullable=False)

    # Step 4: drop the old column
    op.drop_column('players', 'name')


def downgrade() -> None:
    op.add_column('players', sa.Column('name', sa.String(), nullable=True))

    connection = op.get_bind()
    players = connection.execute(sa.text("SELECT id, first_name, last_name FROM players")).fetchall()

    for player in players:
        full_name = f"{player.first_name} {player.last_name}".strip()
        connection.execute(
            sa.text("UPDATE players SET name = :name WHERE id = :id"),
            {"name": full_name, "id": player.id}
        )

    op.alter_column('players', 'name', nullable=False)
    op.drop_column('players', 'first_name')
    op.drop_column('players', 'last_name')
