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
    job_id UUID UNIQUE REFERENCES jobs(id),
    status TEXT,
    applied_at TIMESTAMP,
    notes TEXT,
    feedback TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);