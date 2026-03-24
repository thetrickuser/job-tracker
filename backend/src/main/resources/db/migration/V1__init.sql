CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    title TEXT,
    company TEXT,
    job_url TEXT UNIQUE,
    source TEXT,
    location TEXT,
    salary_min INT,
    salary_max INT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE applications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    job_id UUID NOT NULL REFERENCES jobs(id),
    status TEXT,
    applied_at TIMESTAMP,
    notes TEXT,
    feedback TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT unique_user_job UNIQUE (user_id, job_id)
);