import { pgTable, varchar, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

export const urls = pgTable('urls', {
  id: uuid('id').primaryKey(),
  originalUrl: varchar('original_url', { length: 2048 }).notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  accessCount: integer('access_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;
