-- Add to_address and network columns to the transactions table.
-- Safe to run multiple times (IF NOT EXISTS guards).

alter table transactions
  add column if not exists to_address text,
  add column if not exists network    text default 'Sepolia';
