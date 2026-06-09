export interface ParsedResult {
    student: {
        name: string;
        roll: string;
        branch: BRANCH_NAME;
        college: COLLEGE_NAME;
    };
    grandTotal: {
        maximum: number;
        passing: number;
        obtained: number;
    };
    subjects: SubjectResult[];
    sgpa: number;
    remarks: string;
}

export interface SubjectResult {
    name: string;
    type: PAPER_TYPE;
    credits: number;
    internal: {
        max: number;
        obtained: number;
    };
    external: {
        max: number;
        passing: number;
        obtained: number;
    };
    total: {
        max: number;
        passing: number;
        obtained: number;
    };
    grade: string;
}

export enum PAPER_TYPE {
    THEORY = "THEORY",
    PRACTICAL = "PRACTICAL",
    TERM_WORK = "TERM_WORK",
}

export type BranchConfig = {
    branchName: BRANCH_NAME;
    semester: number;
    collegeCode: number;
    branchCode: number;
    admissionYear: number;
    rollList: number[];
};

export enum COLLEGE_NAME {
    GP_BARAUNI = "GP Barauni",
    GP_BHAGALPUR = "GP Bhagalpur",
    GP_CHHAPRA = "GP Chhapra",
    GP_DARBHANGA = "GP Darbhanga",
    GP_GAYA = "GP Gaya",
    GP_GOPALGANJ = "GP Gopalganj",
    GP_MUZAFFARPUR = "GP Muzaffarpur",
    GP_PATNA_7 = "GP Patna-7",
    GP_PURNEA = "GP Purnea",
    GP_SAHARSA = "GP Saharsa",
    NGP_PATNA_13 = "NGP Patna-13",
    GWP_MUZAFFARPUR = "GWP Muzaffarpur",
    GWP_PATNA = "GWP Patna",
    GP_KATIHAR = "GP Katihar",
    GP_VAISHALI = "GP Vaishali",
    GP_LAKHISARAI = "GP Lakhisarai",
    GP_DEHRIONSONE = "GP Dehrionsone",
    GP_ASTHAWAN_NALANDA = "GP Asthawan, Nalanda",
    GP_SHEOHAR = "GP Sheohar",
    GP_MOTIHARI = "GP Motihari",
    GP_MADHUBANI = "GP Madhubani",
    BKPI_SITAMARHI = "BKPI Sitamarhi",
    GP_MADHEPURA = "GP Madhepura",
    GP_RAGHOPUR_SUPAUL = "GP Raghopur, Supaul",
    KNSGP_SAMASTIPUR = "KNSGP Samastipur",
    BKNSGP_GOPALGANJ = "BKNSGP Gopalganj",
    GP_MUNGER = "GP Munger",
    GP_SHEIKHPURA = "GP Sheikhpura",
    GP_JAMUI = "GP Jamui",
    GP_BANKA = "GP Banka",
    GP_TEKARI_GAYA = "GP Tekari, Gaya",
    GP_KAIMUR = "GP Kaimur",
    GP_BUXAR = "GP Buxar",
    GP_SITAMARHI = "GP Sitamarhi",
    GP_WEST_CHAMPARAN = "GP West Champaran",
    GP_KISHANGANJ = "GP Kishanganj",
    GP_ARARIA = "GP Araria",
    GP_NAWADA = "GP Nawada",
    GP_SIWAN = "GP Siwan",
    GP_ARWAL = "GP Arwal",
    GP_AURANGABAD = "GP Aurangabad",
    GP_BHOJPUR = "GP Bhojpur",
    GP_JEHANABAD = "GP Jehanabad",
    GP_KHAGARIA = "GP Khagaria",
    GP_BARH = "GP Barh",
    GPTT_BHAGALPUR = "GPTT Bhagalpur",
    UNKNOWN = "Unknown College",
}

export const COLLEGE_FULL_NAME: Record<COLLEGE_NAME, string> = {
    [COLLEGE_NAME.GP_BARAUNI]: "Government Polytechnic, Barauni",
    [COLLEGE_NAME.GP_BHAGALPUR]: "Government Polytechnic, Bhagalpur",
    [COLLEGE_NAME.GP_CHHAPRA]: "Government Polytechnic, Chapra",
    [COLLEGE_NAME.GP_DARBHANGA]: "Government Polytechnic, Darbhanga",
    [COLLEGE_NAME.GP_GAYA]: "Government Polytechnic, Gaya",
    [COLLEGE_NAME.GP_GOPALGANJ]: "Government Polytechnic, Gopalganj",
    [COLLEGE_NAME.GP_MUZAFFARPUR]: "Government Polytechnic, Muzaffarpur",
    [COLLEGE_NAME.GP_PATNA_7]: "Government Polytechnic, Patna - 7",
    [COLLEGE_NAME.GP_PURNEA]: "Government Polytechnic, Purnea",
    [COLLEGE_NAME.GP_SAHARSA]: "Government Polytechnic, Saharsa",
    [COLLEGE_NAME.NGP_PATNA_13]: "New Government Polytechnic, Patna - 13",
    [COLLEGE_NAME.GWP_MUZAFFARPUR]: "Government Women's Polytechnic, Muzaffarpur",
    [COLLEGE_NAME.GWP_PATNA]: "Government Women's Polytechnic, Patna",
    [COLLEGE_NAME.GP_KATIHAR]: "Government Polytechnic, Katihar",
    [COLLEGE_NAME.GP_VAISHALI]: "Government Polytechnic, Vaishali",
    [COLLEGE_NAME.GP_LAKHISARAI]: "Government Polytechnic, Lakhisarai",
    [COLLEGE_NAME.GP_DEHRIONSONE]: "Government Polytechnic, Dehrionsone",
    [COLLEGE_NAME.GP_ASTHAWAN_NALANDA]: "Government Polytechnic, Asthawan, Nalanda",
    [COLLEGE_NAME.GP_SHEOHAR]: "Government Polytechnic, Sheohar",
    [COLLEGE_NAME.GP_MOTIHARI]: "Government Polytechnic, Motihari",
    [COLLEGE_NAME.GP_MADHUBANI]: "Government Polytechnic, Madhubani",
    [COLLEGE_NAME.BKPI_SITAMARHI]: "Baddiuzama Khan Polytechnic Institute, Sitamarhi",
    [COLLEGE_NAME.GP_MADHEPURA]: "Government Polytechnic, Madhepura",
    [COLLEGE_NAME.GP_RAGHOPUR_SUPAUL]: "Government Polytechnic, Raghopur, Supaul",
    [COLLEGE_NAME.KNSGP_SAMASTIPUR]: "Kameshwar Narayan Singh Government Polytechnic, Samastipur",
    [COLLEGE_NAME.BKNSGP_GOPALGANJ]: "Braj Kishor Narayan Singh Government Polytechnic, Gopalganj",
    [COLLEGE_NAME.GP_MUNGER]: "Government Polytechnic, Munger",
    [COLLEGE_NAME.GP_SHEIKHPURA]: "Government Polytechnic, Sheikhpura",
    [COLLEGE_NAME.GP_JAMUI]: "Government Polytechnic, Jamui",
    [COLLEGE_NAME.GP_BANKA]: "Government Polytechnic, Banka",
    [COLLEGE_NAME.GP_TEKARI_GAYA]: "Government Polytechnic, Tekari, Gaya",
    [COLLEGE_NAME.GP_KAIMUR]: "Government Polytechnic, Kaimur",
    [COLLEGE_NAME.GP_BUXAR]: "Government Polytechnic, Buxar",
    [COLLEGE_NAME.GP_SITAMARHI]: "Government Polytechnic, Sitamarhi",
    [COLLEGE_NAME.GP_WEST_CHAMPARAN]: "Government Polytechnic, West Champaran",
    [COLLEGE_NAME.GP_KISHANGANJ]: "Government Polytechnic, Kishanganj",
    [COLLEGE_NAME.GP_ARARIA]: "Government Polytechnic, Araria",
    [COLLEGE_NAME.GP_NAWADA]: "Government Polytechnic, Nawada",
    [COLLEGE_NAME.GP_SIWAN]: "Government Polytechnic, Siwan",
    [COLLEGE_NAME.GP_ARWAL]: "Government Polytechnic, Arwal",
    [COLLEGE_NAME.GP_AURANGABAD]: "Government Polytechnic, Aurangabad",
    [COLLEGE_NAME.GP_BHOJPUR]: "Government Polytechnic, Bhojpur",
    [COLLEGE_NAME.GP_JEHANABAD]: "Government Polytechnic, Jehanabad",
    [COLLEGE_NAME.GP_KHAGARIA]: "Government Polytechnic, Khagaria",
    [COLLEGE_NAME.GP_BARH]: "Government Polytechnic, Barh",
    [COLLEGE_NAME.GPTT_BHAGALPUR]: "Government Textile Technology Institute, Bhagalpur",
    [COLLEGE_NAME.UNKNOWN]: "Unknown College",
};

export const COLLEGE_CODES: Record<COLLEGE_NAME, number> = {
    [COLLEGE_NAME.GP_BARAUNI]: 111,
    [COLLEGE_NAME.GP_BHAGALPUR]: 112,
    [COLLEGE_NAME.GP_CHHAPRA]: 113,
    [COLLEGE_NAME.GP_DARBHANGA]: 114,
    [COLLEGE_NAME.GP_GAYA]: 115,
    [COLLEGE_NAME.GP_GOPALGANJ]: 116,
    [COLLEGE_NAME.GP_MUZAFFARPUR]: 117,
    [COLLEGE_NAME.GP_PATNA_7]: 118,
    [COLLEGE_NAME.GP_PURNEA]: 119,
    [COLLEGE_NAME.GP_SAHARSA]: 120,
    [COLLEGE_NAME.NGP_PATNA_13]: 121,
    [COLLEGE_NAME.GWP_MUZAFFARPUR]: 122,
    [COLLEGE_NAME.GWP_PATNA]: 123,
    [COLLEGE_NAME.GP_KATIHAR]: 124,
    [COLLEGE_NAME.GP_VAISHALI]: 125,
    [COLLEGE_NAME.GP_LAKHISARAI]: 126,
    [COLLEGE_NAME.GP_DEHRIONSONE]: 127,
    [COLLEGE_NAME.GP_ASTHAWAN_NALANDA]: 128,
    [COLLEGE_NAME.GP_SHEOHAR]: 129,
    [COLLEGE_NAME.GP_MOTIHARI]: 130,
    [COLLEGE_NAME.GP_MADHUBANI]: 131,
    [COLLEGE_NAME.BKPI_SITAMARHI]: 132,
    [COLLEGE_NAME.GP_MADHEPURA]: 133,
    [COLLEGE_NAME.GP_RAGHOPUR_SUPAUL]: 134,
    [COLLEGE_NAME.KNSGP_SAMASTIPUR]: 135,
    [COLLEGE_NAME.BKNSGP_GOPALGANJ]: 136,
    [COLLEGE_NAME.GP_MUNGER]: 137,
    [COLLEGE_NAME.GP_SHEIKHPURA]: 138,
    [COLLEGE_NAME.GP_JAMUI]: 139,
    [COLLEGE_NAME.GP_BANKA]: 140,
    [COLLEGE_NAME.GP_TEKARI_GAYA]: 141,
    [COLLEGE_NAME.GP_KAIMUR]: 142,
    [COLLEGE_NAME.GP_BUXAR]: 143,
    [COLLEGE_NAME.GP_SITAMARHI]: 144,
    [COLLEGE_NAME.GP_WEST_CHAMPARAN]: 145,
    [COLLEGE_NAME.GP_KISHANGANJ]: 146,
    [COLLEGE_NAME.GP_ARARIA]: 147,
    [COLLEGE_NAME.GP_NAWADA]: 148,
    [COLLEGE_NAME.GP_SIWAN]: 149,
    [COLLEGE_NAME.GP_ARWAL]: 150,
    [COLLEGE_NAME.GP_AURANGABAD]: 151,
    [COLLEGE_NAME.GP_BHOJPUR]: 152,
    [COLLEGE_NAME.GP_JEHANABAD]: 153,
    [COLLEGE_NAME.GP_KHAGARIA]: 154,
    [COLLEGE_NAME.GP_BARH]: 155,
    [COLLEGE_NAME.GPTT_BHAGALPUR]: 156,
    [COLLEGE_NAME.UNKNOWN]: 0,
};

export enum BRANCH_NAME {
    CIVIL = "Civil",
    CSE = "CSE",
    ELECTRICAL = "Electrical",
    ELECTRONICS = "Electronics",
    MECHANICAL = "Mechanical",
    AUTOMOBILE = "Automobile",
    ECE = "ECE",
    UNKNOWN = "Unknown",
}

export const BRANCH_CODES = {
    [BRANCH_NAME.CIVIL]: 15,
    [BRANCH_NAME.CSE]: 18,
    [BRANCH_NAME.ELECTRICAL]: 20,
    [BRANCH_NAME.ELECTRONICS]: 21,
    [BRANCH_NAME.MECHANICAL]: 25,
    [BRANCH_NAME.AUTOMOBILE]: 33,
    [BRANCH_NAME.ECE]: 38,
};
