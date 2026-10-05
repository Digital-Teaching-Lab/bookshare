CREATE TABLE `recommendations` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`reason` text NOT NULL,
	`date` text NOT NULL,
	`photo` text,
	`audio` text,
	`cover` text,
	`link` text,
	`provider` text,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `recommendations_owner_created` ON `recommendations` (`owner`,`created`);