import type { BranchMeta, CollegeMeta } from "@app/shared/dto";
import { createMemo, createResource } from "solid-js";
import { fetchMeta } from "~/lib/api/results";

const [metaResource, { refetch }] = createResource(() => fetchMeta());

export function useMeta() {
	const data = () => metaResource();
	const loading = () => metaResource.loading;
	const error = () => metaResource.error;

	const collegeMap = createMemo(() => {
		const map = new Map<number, CollegeMeta>();
		const colleges = data()?.colleges ?? [];
		for (const c of colleges) {
			map.set(c.code, c);
		}
		return map;
	});

	const branchMap = createMemo(() => {
		const map = new Map<number, BranchMeta>();
		const branches = data()?.branches ?? [];
		for (const b of branches) {
			map.set(b.code, b);
		}
		return map;
	});

	function getCollege(code: number): CollegeMeta | undefined {
		return collegeMap().get(code);
	}

	function getCollegeName(code: number): string {
		return collegeMap().get(code)?.short_name ?? `College ${code}`;
	}

	function getCollegeFullName(code: number): string {
		return collegeMap().get(code)?.full_name ?? `College ${code}`;
	}

	function getBranchName(code: number): string {
		return branchMap().get(code)?.name ?? `Branch ${code}`;
	}

	function getCollegeCode(nameOrCode: string | number): number | undefined {
		if (typeof nameOrCode === "number") return nameOrCode;
		const n = Number.parseInt(nameOrCode, 10);
		if (!Number.isNaN(n) && collegeMap().has(n)) {
			return n;
		}
		const lower = nameOrCode.trim().toLowerCase();
		for (const c of collegeMap().values()) {
			if (c.short_name.toLowerCase() === lower || c.full_name.toLowerCase() === lower) {
				return c.code;
			}
		}
		return undefined;
	}

	function getBranchCode(nameOrCode: string | number): number | undefined {
		if (typeof nameOrCode === "number") return nameOrCode;
		const n = Number.parseInt(nameOrCode, 10);
		if (!Number.isNaN(n) && branchMap().has(n)) {
			return n;
		}
		const lower = nameOrCode.trim().toLowerCase();
		for (const b of branchMap().values()) {
			if (b.name.toLowerCase() === lower) {
				return b.code;
			}
		}
		return undefined;
	}

	function getCollegeCanonicalName(nameOrCode: string | number): string {
		const code = getCollegeCode(nameOrCode);
		if (code !== undefined) {
			return getCollegeName(code);
		}
		return String(nameOrCode);
	}

	function getBranchCanonicalName(nameOrCode: string | number): string {
		const code = getBranchCode(nameOrCode);
		if (code !== undefined) {
			return getBranchName(code);
		}
		return String(nameOrCode);
	}

	return {
		data,
		loading,
		error,
		refetch,
		colleges: () => data()?.colleges ?? [],
		branches: () => data()?.branches ?? [],
		semesters: () => data()?.semesters ?? [1, 2, 3, 4, 5, 6],
		sessions: () => data()?.sessions ?? [],
		totalResults: () => data()?.total_results ?? 0,
		totalStudents: () => data()?.total_students ?? 0,
		dataVersion: () => data()?.data_version ?? 0,
		getCollege,
		getCollegeName,
		getCollegeFullName,
		getBranchName,
		getCollegeCode,
		getBranchCode,
		getCollegeCanonicalName,
		getBranchCanonicalName,
	};
}
