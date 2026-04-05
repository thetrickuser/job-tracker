CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP
);

-- update applications table

ALTER TABLE applications
    ADD COLUMN user_id UUID;

-- remove old constraint (job_id UNIQUE)
ALTER TABLE applications
    DROP CONSTRAINT applications_job_id_key;

-- add new constraints
ALTER TABLE applications
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    ADD CONSTRAINT unique_user_job UNIQUE (user_id, job_id);