-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Lookup tables
CREATE TABLE college (
    code       smallint PRIMARY KEY,
    short_name text     NOT NULL,
    full_name  text     NOT NULL
);

CREATE TABLE branch (
    code smallint PRIMARY KEY,
    name text     NOT NULL
);

CREATE TABLE remark (
    id   smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text text     NOT NULL UNIQUE
);

CREATE TABLE subject (
    id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text    NOT NULL UNIQUE
);

-- Main Data
CREATE TABLE student (
    id           integer  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reg_no       text     NOT NULL UNIQUE,
    name         text     NOT NULL,
    college_code smallint NOT NULL REFERENCES college (code),
    branch_code  smallint NOT NULL REFERENCES branch (code),
    session      text     NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE result (
    id             integer  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    roll           text     NOT NULL UNIQUE,
    student_id     integer  NOT NULL REFERENCES student (id),
    name           text     NOT NULL,  -- name as printed on this result slip
    semester       smallint NOT NULL,
    college_code   smallint NOT NULL,  -- denormalized from roll for fast filtering
    branch_code    smallint NOT NULL,  -- denormalized from roll for fast filtering
    session        text     NOT NULL,
    total_max      smallint NOT NULL,
    total_passing  smallint NOT NULL,
    total_obtained smallint NOT NULL,
    sgpa_x100      smallint NOT NULL,  -- integer hundredths (e.g. 8.45 → 845)
    cgpa_x100      smallint,           -- null except on 6th sem
    remark_id      smallint NOT NULL REFERENCES remark (id),
    created_at     timestamptz NOT NULL DEFAULT current_timestamp,
    UNIQUE (student_id, semester)
);

CREATE TABLE result_subject (
    result_id          integer  NOT NULL REFERENCES result (id) ON DELETE CASCADE,
    subject_id         integer  NOT NULL REFERENCES subject (id),
    type               smallint NOT NULL, -- 1=theory, 2=practical, 3=term work
    credits            real,
    internal_max       smallint,
    internal_obtained  smallint,
    external_max       smallint,
    external_passing   smallint,
    external_obtained  smallint,
    total_max          smallint,
    total_passing      smallint,
    total_obtained     smallint,
    grade              text     NOT NULL,
    PRIMARY KEY (result_id, subject_id, type)
);

CREATE TABLE invalid_roll (
    roll       text PRIMARY KEY,
    checked_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE data_version (
    id         integer PRIMARY KEY DEFAULT 1,
    version    bigint  NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT current_timestamp,
    CONSTRAINT data_version_single_row CHECK (id = 1)
);
INSERT INTO data_version (id, version) VALUES (1, 0);

-- Keyset pagination / sort columns
CREATE INDEX result_marks_roll ON result (total_obtained, roll);
CREATE INDEX result_sgpa_roll  ON result (sgpa_x100, roll);
CREATE INDEX result_name_roll  ON result (name, roll);
CREATE INDEX result_reg_roll   ON result (student_id, roll);

-- Trigram search
CREATE INDEX result_name_trgm ON result USING gin (name gin_trgm_ops);
CREATE INDEX result_roll_trgm ON result USING gin (roll gin_trgm_ops);

-- Filter columns
CREATE INDEX result_college ON result (college_code);
CREATE INDEX result_branch  ON result (branch_code);
CREATE INDEX result_sem     ON result (semester);
CREATE INDEX result_session ON result (session);

