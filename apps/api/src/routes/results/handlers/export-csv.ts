import type { ExportField, ExportQuery } from "@app/shared/schemas";
import { db } from "~/db/index";

function escapeCsv(val: unknown): string {
	if (val == null) return "";
	const str = String(val);
	if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

export function createExportCsvStream(query: ExportQuery): ReadableStream {
	const selectedFields = (query.fields ?? [
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
	]) as ExportField[];

	const BATCH_SIZE = 1000;
	const encoder = new TextEncoder();

	return new ReadableStream({
		async start(controller) {
			try {
				const headerLine = `${selectedFields.map((f) => escapeCsv(f)).join(",")}\n`;
				controller.enqueue(encoder.encode(headerLine));

				let lastId = 0;

				while (true) {
					let qb = db
						.selectFrom("result")
						.innerJoin("college", "college.code", "result.college_code")
						.innerJoin("branch", "branch.code", "result.branch_code")
						.innerJoin("remark", "remark.id", "result.remark_id")
						.where("result.id", ">", lastId);

					if (query.college && query.college.length > 0) {
						qb =
							query.college.length === 1
								? qb.where("result.college_code", "=", query.college[0])
								: qb.where("result.college_code", "in", query.college);
					}
					if (query.branch && query.branch.length > 0) {
						qb =
							query.branch.length === 1
								? qb.where("result.branch_code", "=", query.branch[0])
								: qb.where("result.branch_code", "in", query.branch);
					}
					if (query.sem && query.sem.length > 0) {
						qb =
							query.sem.length === 1
								? qb.where("result.semester", "=", query.sem[0])
								: qb.where("result.semester", "in", query.sem);
					}
					if (query.session && query.session.length > 0) {
						qb =
							query.session.length === 1
								? qb.where("result.session", "=", query.session[0])
								: qb.where("result.session", "in", query.session);
					}
					if (query.q) {
						const pattern = `%${query.q}%`;
						qb = qb.where((eb) =>
							eb.or([
								eb("result.name", "ilike", pattern),
								eb("result.roll", "like", pattern),
							]),
						);
					}

					const rows = await qb
						.select([
							"result.id",
							"result.roll",
							"result.name",
							"result.semester",
							"college.short_name as college",
							"branch.name as branch",
							"result.session",
							"result.total_obtained",
							"result.total_max",
							"result.sgpa_x100",
							"result.cgpa_x100",
							"remark.text as remark",
						])
						.orderBy("result.id", "asc")
						.limit(BATCH_SIZE)
						.execute();

					if (rows.length === 0) break;

					let batchChunk = "";
					for (const r of rows) {
						const values = selectedFields.map((field) => {
							switch (field) {
								case "roll":
									return escapeCsv(r.roll);
								case "name":
									return escapeCsv(r.name);
								case "semester":
									return escapeCsv(r.semester);
								case "college":
									return escapeCsv(r.college);
								case "branch":
									return escapeCsv(r.branch);
								case "session":
									return escapeCsv(r.session);
								case "total_obtained":
									return escapeCsv(r.total_obtained);
								case "total_max":
									return escapeCsv(r.total_max);
								case "sgpa":
									return escapeCsv((r.sgpa_x100 / 100).toFixed(2));
								case "cgpa":
									return escapeCsv(
										r.cgpa_x100 != null ? (r.cgpa_x100 / 100).toFixed(2) : "",
									);
								case "remark":
									return escapeCsv(r.remark);
								default:
									return "";
							}
						});
						batchChunk += `${values.join(",")}\n`;
					}

					controller.enqueue(encoder.encode(batchChunk));
					lastId = rows[rows.length - 1].id;

					if (rows.length < BATCH_SIZE) break;
				}

				controller.close();
			} catch (err) {
				controller.error(err);
			}
		},
	});
}
