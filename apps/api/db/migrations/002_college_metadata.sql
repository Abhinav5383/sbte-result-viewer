-- Distinguish govt and private colleges
ALTER TABLE college
    ADD COLUMN type text NOT NULL DEFAULT 'govt' CHECK (type IN ('govt', 'private'));

-- Which branches each college offers, and how many seats each has.
-- `seats` is the approved intake, `extra_seats` is any additional supernumerary seats ("60+5*").
CREATE TABLE college_branch (
    college_code smallint NOT NULL REFERENCES college (code),
    branch_code  smallint NOT NULL REFERENCES branch (code),
    seats        smallint NOT NULL CHECK (seats > 0),
    extra_seats  smallint NOT NULL DEFAULT 0 CHECK (extra_seats >= 0),
    PRIMARY KEY (college_code, branch_code)
);

CREATE INDEX college_branch_branch ON college_branch (branch_code);
