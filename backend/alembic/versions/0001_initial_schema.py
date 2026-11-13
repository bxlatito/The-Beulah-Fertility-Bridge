"""initial schema

Revision ID: 0001
Revises: 
Create Date: 2026-11-13 05:48:12.184110
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = '0001'
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table('admin_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=254), nullable=False),
    sa.Column('hashed_password', sa.String(length=128), nullable=False),
    sa.Column('is_active', sa.Boolean(), server_default=sa.true(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('admin_users', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_admin_users_email'), ['email'], unique=True)

    op.create_table('contact_submissions',
    sa.Column('name', sa.String(length=160), nullable=False),
    sa.Column('email', sa.String(length=254), nullable=False),
    sa.Column('subject', sa.String(length=120), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=16), server_default='new', nullable=False),
    sa.Column('admin_note', sa.Text(), nullable=True),
    sa.Column('consent', sa.Boolean(), server_default=sa.false(), nullable=False),
    sa.Column('consent_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('contact_submissions', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_contact_submissions_email'), ['email'], unique=False)
        batch_op.create_index(batch_op.f('ix_contact_submissions_status'), ['status'], unique=False)

    op.create_table('donations',
    sa.Column('reference', sa.String(length=24), nullable=False),
    sa.Column('amount', sa.Numeric(precision=14, scale=2), nullable=False),
    sa.Column('currency', sa.String(length=3), nullable=False),
    sa.Column('name', sa.String(length=160), nullable=True),
    sa.Column('email', sa.String(length=254), nullable=True),
    sa.Column('message', sa.Text(), nullable=True),
    sa.Column('payment_status', sa.String(length=16), server_default='pending', nullable=False),
    sa.Column('payment_reference', sa.String(length=120), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=16), server_default='new', nullable=False),
    sa.Column('admin_note', sa.Text(), nullable=True),
    sa.Column('consent', sa.Boolean(), server_default=sa.false(), nullable=False),
    sa.Column('consent_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('donations', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_donations_reference'), ['reference'], unique=True)
        batch_op.create_index(batch_op.f('ix_donations_status'), ['status'], unique=False)

    op.create_table('pages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('slug', sa.String(length=80), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('body', sa.Text(), nullable=False),
    sa.Column('published', sa.Boolean(), server_default=sa.false(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('pages', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_pages_slug'), ['slug'], unique=True)

    op.create_table('support_enquiries',
    sa.Column('name', sa.String(length=160), nullable=False),
    sa.Column('email', sa.String(length=254), nullable=False),
    sa.Column('phone', sa.String(length=32), nullable=True),
    sa.Column('who_for', sa.String(length=60), nullable=False),
    sa.Column('support_types', sa.JSON(), nullable=False),
    sa.Column('financial_need', sa.String(length=60), nullable=True),
    sa.Column('journey', sa.Text(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=16), server_default='new', nullable=False),
    sa.Column('admin_note', sa.Text(), nullable=True),
    sa.Column('consent', sa.Boolean(), server_default=sa.false(), nullable=False),
    sa.Column('consent_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('support_enquiries', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_support_enquiries_email'), ['email'], unique=False)
        batch_op.create_index(batch_op.f('ix_support_enquiries_status'), ['status'], unique=False)


def downgrade() -> None:
    with op.batch_alter_table('support_enquiries', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_support_enquiries_status'))
        batch_op.drop_index(batch_op.f('ix_support_enquiries_email'))

    op.drop_table('support_enquiries')
    with op.batch_alter_table('pages', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_pages_slug'))

    op.drop_table('pages')
    with op.batch_alter_table('donations', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_donations_status'))
        batch_op.drop_index(batch_op.f('ix_donations_reference'))

    op.drop_table('donations')
    with op.batch_alter_table('contact_submissions', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_contact_submissions_status'))
        batch_op.drop_index(batch_op.f('ix_contact_submissions_email'))

    op.drop_table('contact_submissions')
    with op.batch_alter_table('admin_users', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_admin_users_email'))

    op.drop_table('admin_users')