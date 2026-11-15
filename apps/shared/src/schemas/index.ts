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

const ResultSortBy = z.enum(["marks", "sgpa", "name", "reg_no", "roll"]);
export type ResultSortBy = z.infer<typeof ResultSortBy>;

const SortOrder = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof SortOrder>;

export const ResultQuerySchema = z.object({
	college: numberArrayParam,
	branch: numberArrayParam,
	sem: semesterArrayParam,
	session: stringArrayParam,
	q: z.string().min(2).max(100).optional(),
	by: ResultSortBy.default("marks"),
	order: SortOrder.default("desc"),
	cursor: z.string().max(512).optional(),
	limit: z.coerce.number().int().min(1).max(1000).default(100),
});

export type ResultQuery = z.infer<typeof ResultQuerySchema>;

export const LeaderboardSortBy = z.enum(["sgpa", "marks", "name", "reg_no", "cgpa"]);
export type LeaderboardSortBy = z.infer<typeof LeaderboardSortBy>;

export const LeaderboardQuerySchema = z.object({
	college: numberArrayParam,
	branch: numberArrayParam,
	sem: semesterArrayParam,
	session: stringArrayParam,
	by: LeaderboardSortBy.default("sgpa"),
	order: SortOrder.default("desc"),
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

const ExportField = z.enum([
	"roll",
	"name",
	"semester",
	"college",
	"branch",
	"session",
	"total_obtained",
	"total_max",
	"sgpa",
	"cgpa",
	"remark",
]);
export type ExportField = z.infer<typeof ExportField>;

export const ExportQuerySchema = ResultQuerySchema.omit({
	cursor: true,
	limit: true,
	by: true,
	order: true,
}).extend({
	fields: z
		.string()
		.optional()
		.transform((v?: string) =>
			v
				? (v
						.split(",")
						.map((f: string) => f.trim())
						.filter(Boolean) as ExportField[])
				: ExportField.options,
		),
});

export type ExportQuery = z.infer<typeof ExportQuerySchema>;
