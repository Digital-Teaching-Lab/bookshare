import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const recommendations=sqliteTable('recommendations',{
 id:text('id').primaryKey(),owner:text('owner').notNull(),name:text('name').notNull(),title:text('title').notNull(),reason:text('reason').notNull(),date:text('date').notNull(),photo:text('photo'),audio:text('audio'),cover:text('cover'),link:text('link'),provider:text('provider'),created:text('created').notNull()
},t=>[index('recommendations_owner_created').on(t.owner,t.created)]);

export const bookMetadata=sqliteTable('book_metadata',{id:text('id').primaryKey(),owner:text('owner').notNull(),author:text('author'),publisher:text('publisher')});
export const teacherSettings=sqliteTable('teacher_settings',{owner:text('owner').primaryKey(),className:text('class_name').notNull()});
