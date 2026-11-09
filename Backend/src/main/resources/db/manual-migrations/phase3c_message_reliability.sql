-- SupportlyAI Phase 3C
-- Run once on an existing MySQL database after checking the current schema.
-- Backup the database before running.
-- The meta_message_id UNIQUE index is required for webhook deduplication.

ALTER TABLE chat_messages
MODIFY COLUMN status ENUM(
    'DELIVERED',
    'FAILED',
    'PENDING',
    'READ',
    'RECEIVED',
    'SENT',
    'UNKNOWN'
) NOT NULL;

-- For databases without the unique index, first verify no duplicate
-- non-NULL meta_message_id values exist, then execute:
--
-- ALTER TABLE chat_messages
-- ADD CONSTRAINT uk_chat_messages_meta_message_id
-- UNIQUE (meta_message_id);
