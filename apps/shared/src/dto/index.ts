export type ApiResponse<T> = { success: false; error: string } | { success: true; data: T };

export type SubjectDetail = {
	name: string;
	type: number; // 1=theory 2=practical 3=term work
	credits: number | null;
	internal: { max: number | null; obtained: number | null };
	external: {
		max: number | null;
		passing: number | null;
		obtained: number | null;
	};
	total: {
		max: number | null;
		passing: number | null;
		obtained: number | null;
	};
	grade: string;
};

export type SemesterSummary = {
	roll: string;
	semester: number;
	total_obtained: number;
	total_max: number;
	sgpa_x100: number;
	cgpa_x100: number | null;
	remark: string;
};

export type StudentInfo = {
	reg_no: string;
	name: string;
	college_code: number;
	branch_code: number;
	session: string;
	results: SemesterSummary[];
};

export type ResultRow = {
	roll: string;
	name: string;
	semester: number;
	college_code: number;
	branch_code: number;
	session: string;
	total_max: number;
	total_passing: number;
	total_obtained: number;
	sgpa_x100: number;
	cgpa_x100: number | null;
	remark: string;
};

export type ResultListData = {
	results: ResultRow[];
	total?: number;
	next_cursor?: string;
	data_version: number;
};

export type ResultListResponse = ApiResponse<ResultListData>;

export type ResultDetail = {
	roll: string;
	name: string;
	semester: number;
	college_code: number;
	branch_code: number;
	session: string;
	total_max: number;
	total_passing: number;
	total_obtained: number;
	sgpa_x100: number;
	cgpa_x100: number | null;
	remark: string;
	subjects: SubjectDetail[];
};

export type ResultDetailData = {
	result: ResultDetail;
	student: StudentInfo;
	results: ResultDetail[];
};

export type ResultDetailResponse = ApiResponse<ResultDetailData>;

export type CollegeMeta = {
	code: number;
	short_name: string;
	full_name: string;
};

export type BranchMeta = {
	code: number;
	name: string;
};

export type MetaData = {
	colleges: CollegeMeta[];
	branches: BranchMeta[];
	semesters: number[];
	sessions: string[];
	total_results?: number;
	total_students?: number;
	data_version: number;
};

export type MetaResponse = ApiResponse<MetaData>;

export type LeaderboardRow = {
	reg_no: string;
	name: string;
	college_code: number;
	branch_code: number;
	session: string;
	avg_obtained: number;
	avg_max: number;
	avg_sgpa_x100: number;
	cgpa_x100: number | null;
	semesters_count: number;
	rank: number;
};

export type LeaderboardData = {
	results: LeaderboardRow[];
	total?: number;
	next_cursor?: string;
	data_version: number;
};

export type LeaderboardResponse = ApiResponse<LeaderboardData>;

export type StudentRow = {
	reg_no: string;
	name: string;
	college_code: number;
	branch_code: number;
	session: string;
};

export type StudentsData = {
	students: StudentRow[];
};

export type StudentsResponse = ApiResponse<StudentsData>;
