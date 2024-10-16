-- SQL dump generated using DBML (dbml.dbdiagram.io)
-- Database: PostgreSQL
-- Generated at: 2024-10-16T21:11:46.141Z

CREATE TABLE "users" (
  "id" integer UNIQUE PRIMARY KEY,
  "username" varchar NOT NULL,
  "role" varchar DEFAULT 'user',
  "created_at" timestamp NOT NULL
);

CREATE TABLE "email_templates" (
  "id" integer UNIQUE PRIMARY KEY,
  "name" varchar,
  "subject" varchar,
  "body" TEXT
);

CREATE TABLE "campaign" (
  "id" integer UNIQUE PRIMARY KEY,
  "title" varchar DEFAULT 'Campaign Title',
  "notes" text DEFAULT null,
  "user_id" integer,
  "status" bool DEFAULT false,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "test" (
  "id" integer UNIQUE PRIMARY KEY,
  "title" varchar DEFAULT 'Test Name',
  "content" varchar,
  "sender" varchar,
  "camp_id" integer,
  "status" bool DEFAULT false,
  "created_at" timestamp NOT NULL,
  "template_id" integer
);

CREATE TABLE "targets" (
  "id" integer UNIQUE PRIMARY KEY,
  "name" varchar NOT NULL,
  "email_addr" varchar NOT NULL
);

CREATE TABLE "test_targets" (
  "test_id" integer,
  "target_id" integer,
  "clicked" timestamp DEFAULT null
);

COMMENT ON COLUMN "users"."role" IS 'will we even have multiple roles?';

COMMENT ON COLUMN "campaign"."status" IS 'Might need more than a bool';

COMMENT ON COLUMN "test"."content" IS 'Email content';

COMMENT ON COLUMN "test"."sender" IS 'Sender address';

COMMENT ON COLUMN "test"."status" IS 'Might need more than a bool';

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "campaign" ("user_id");

ALTER TABLE "campaign" ADD FOREIGN KEY ("id") REFERENCES "test" ("camp_id");

ALTER TABLE "test" ADD FOREIGN KEY ("template_id") REFERENCES "email_templates" ("id");

CREATE TABLE "test_test_targets" (
  "test_id" integer,
  "test_targets_test_id" integer,
  PRIMARY KEY ("test_id", "test_targets_test_id")
);

ALTER TABLE "test_test_targets" ADD FOREIGN KEY ("test_id") REFERENCES "test" ("id");

ALTER TABLE "test_test_targets" ADD FOREIGN KEY ("test_targets_test_id") REFERENCES "test_targets" ("test_id");


CREATE TABLE "targets_test_targets" (
  "targets_id" integer,
  "test_targets_target_id" integer,
  PRIMARY KEY ("targets_id", "test_targets_target_id")
);

ALTER TABLE "targets_test_targets" ADD FOREIGN KEY ("targets_id") REFERENCES "targets" ("id");

ALTER TABLE "targets_test_targets" ADD FOREIGN KEY ("test_targets_target_id") REFERENCES "test_targets" ("target_id");

