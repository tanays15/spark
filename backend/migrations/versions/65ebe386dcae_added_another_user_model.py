"""Added another user model

Revision ID: 65ebe386dcae
Revises: 56a00c7d17e4
Create Date: 2025-02-23 03:13:44.327384

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '65ebe386dcae'
down_revision = '56a00c7d17e4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('records', schema=None) as batch_op:
        batch_op.add_column(sa.Column('visualScore', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('audioScore', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('feedback', sa.String(), nullable=False))
        batch_op.add_column(sa.Column('resources', sa.String(), nullable=False))
        batch_op.drop_column('confidenceScore')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('records', schema=None) as batch_op:
        batch_op.add_column(sa.Column('confidenceScore', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.drop_column('resources')
        batch_op.drop_column('feedback')
        batch_op.drop_column('audioScore')
        batch_op.drop_column('visualScore')

    # ### end Alembic commands ###
