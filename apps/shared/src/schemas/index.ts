import { z } from "zod";

const positiveInt = z.coerce.number().int().positive();

export const numberArrayParam = z
	.union([z.string(), z.array(z.string()), z.number(), z.array(z.number())])
	.optional()
	.transform((val) => {
		if (val === undefined || val === null || val === "") return undefined;
		const raw = Array.isArray(val) ? val : String(val).split(",");
		const nums = raw
			.map((n) => Number.parseInt(String(n).trim(), 10))
			.filter((n) => !Number.isNaN(n) && n > 0);
		return nums.length > 0 ? nums : undefined;
	});

export const semesterArrayParam = z
	.union([z.string(), z.array(z.string()), z.number(), z.array(z.number())])
	.optional()
	.transform((val) => {
		if (val === undefined || val === null || val === "") return undefined;
		const raw = Array.isArray(val) ? val : String(val).split(",");
		const nums = raw
			.map((n) => Number.parseInt(String(n).trim(), 10))
			.filter((n) => !Number.isNaN(n) && n >= 1 && n <= 6);
		return nums.length > 0 ? nums : undefined;
	});

export const stringArrayParam = z
	.union([z.string(), z.array(z.string())])
	.optional()
	.transform((val) => {
		if (val === undefined || val === null || val === "") return undefined;
		const raw = Array.isArray(val) ? val : String(val).split(",");
		const strs = raw.map((s) => s.trim()).filter(Boolean);
		return strs.length > 0 ? strs : undefined;
	});

export enum FilterParams {
	COLLEGE = "college",
	BRANCH = "branch",
	SEMESTER = "sem",
	SESSION = "session",
	QUERY = "q",
	SORT_BY = "by",
	SORT_ORDER = "order",
}

export enum SortDirection {
	ASC = "asc",
	DESC = "desc",
}

export enum SortBy {
	MARKS = "marks",
	SGPA = "sgpa",
	NAME = "name",
	REG_NO = "reg_no",
	ROLL = "roll",
}

export const SortBySchema = z.enum(SortBy);
export const SortDirectionSchema = z.enum(SortDirection);

export const ResultQuerySchema = z.object({
	college: numberArrayParam,
	branch: numberArrayParam,
	sem: semesterArrayParam,
	session: stringArrayParam,
	q: z.string().min(2).max(100).optional(),
	by: SortBySchema.default(SortBy.MARKS),
	order: SortDirectionSchema.default(SortDirection.DESC),
	cursor: z.string().max(512).optional(),
	limit: z.coerce.number().int().min(1).max(1000).default(100),
});

export type ResultQuery = z.infer<typeof ResultQuerySchema>;

export const LeaderboardQuerySchema = z.object({
	college: numberArrayParam,
	branch: numberArrayParam,
	sem: semesterArrayParam,
	session: stringArrayParam,
	by: SortBySchema.default(SortBy.SGPA),
	order: SortDirectionSchema.default(SortDirection.DESC),
	cursor: z.string().max(512).optional(),
	limit: z.coerce.number().int().min(1).max(1000).default(100),
});

export type LeaderboardQuery = z.infer<typeof LeaderboardQuerySchema>;

export const StudentsQuerySchema = z.object({
	college: positiveInt.optional(),
	branch: positiveInt.optional(),
	session: z.string().max(4).optional(),
	q: z.string().min(2).max(100).optional(),
});

export type StudentsQuery = z.infer<typeof StudentsQuerySchema>;

export enum ExportField {
	ROLL = "roll",
	NAME = "name",
	SEMESTER = "semester",
	COLLEGE = "college",
	BRANCH = "branch",
	SESSION = "session",
	TOTAL_OBTAINED = "total_obtained",
	TOTAL_MAX = "total_max",
	SGPA = "sgpa",
	CGPA = "cgpa",
	REMARK = "remark",
}

export const ALL_EXPORT_FIELDS = Object.values(ExportField);
export const ExportFieldSchema = z.enum(ExportField);

export const ExportQuerySchema = ResultQuerySchema.omit({
	cursor: true,
	limit: true,
	by: true,
	order: true,
}).extend({
	fields: z
		.string()
		.optional()
		.transform((v?: string) => {
			const fields = (v ?? "")
				.split(",")
				.map((f) => f.trim())
				.filter((f): f is ExportField => ALL_EXPORT_FIELDS.includes(f as ExportField));
			return fields.length > 0 ? fields : ALL_EXPORT_FIELDS;
		}),
});

export type ExportQuery = z.infer<typeof ExportQuerySchema>;
