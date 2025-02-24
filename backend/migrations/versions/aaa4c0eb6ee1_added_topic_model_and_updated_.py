"""Added Topic model and updated relationships

Revision ID: aaa4c0eb6ee1
Revises: a10e17fdcf01
Create Date: 2025-02-22 16:29:51.471705

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'aaa4c0eb6ee1'
down_revision = 'a10e17fdcf01'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('topics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('records', schema=None) as batch_op:
        batch_op.add_column(sa.Column('topic_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(None, 'topics', ['topic_id'], ['id'])
        batch_op.drop_column('topic_name')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('records', schema=None) as batch_op:
        batch_op.add_column(sa.Column('topic_name', sa.VARCHAR(length=100), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('topic_id')

    op.drop_table('topics')
    # ### end Alembic commands ###
