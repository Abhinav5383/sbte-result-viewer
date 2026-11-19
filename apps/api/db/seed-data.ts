import { CollegeType } from "@app/shared/dto";

export type SeedBranch = { code: number; name: string };
export type SeedCollegeBranch = { branch: number; seats: number; extraSeats?: number };
export type SeedCollege = {
	code: number;
	type: CollegeType;
	shortName: string;
	fullName: string;
	branches: SeedCollegeBranch[];
};

export const BRANCHES: SeedBranch[] = [
	{ code: 11, name: "Agricultural" },
	{ code: 12, name: "Automobile" },
	{ code: 13, name: "Ceramics" },
	{ code: 14, name: "Chemical" },
	{ code: 15, name: "Civil" },
	{ code: 16, name: "Civil (Rural)" },
	{ code: 18, name: "CSE" },
	{ code: 20, name: "Electrical" },
	{ code: 21, name: "Electronics" },
	{ code: 25, name: "Mechanical" },
	{ code: 26, name: "Modern Office Practice" },
	{ code: 27, name: "Printing Tech." },
	{ code: 28, name: "Textile" },
	{ code: 33, name: "Mechanical (Automobile)" },
	{ code: 38, name: "ECE" },
	{ code: 39, name: "Electrical & Electronics" },
	{ code: 41, name: "Library & Info Science" },
	{ code: 43, name: "Electronics (Robotics)" },
	{ code: 44, name: "AI & ML" },
	{ code: 45, name: "Civil (Construction Tech.)" },
	{ code: 46, name: "Mechanical (CAD/CAM)" },
	{ code: 47, name: "Mining" },
	{ code: 48, name: "Fire Tech. & Safety" },
	{ code: 49, name: "Food Processing & Preservation" },
	{ code: 50, name: "Costume Design & Dress Making" },
	{ code: 51, name: "Fashion & Clothing Tech." },
	{ code: 52, name: "Garment Tech." },
	{ code: 53, name: "Textile Tech." },
	{ code: 56, name: "Computer Engg." },
	{ code: 66, name: "Artificial Intelligence" },
	{ code: 67, name: "Computer Science" },
	{ code: 68, name: "Microelectronics & VLSI" },
	{ code: 69, name: "EV Technology" },
	{ code: 70, name: "Renewable Energy" },
	{ code: 71, name: "Information Technology" },
	{ code: 72, name: "Leather Tech." },
	{ code: 73, name: "Computer Science & IT" },
	{ code: 74, name: "Electronics Comm. & Instr." },
	{ code: 75, name: "Electronics & Electrical" },
	{ code: 76, name: "Medical Lab. Tech." },
	{ code: 77, name: "Computer Application" },
];

export const COLLEGES: SeedCollege[] = [
	{
		code: 111,
		type: CollegeType.GOVT,
		shortName: "GP Barauni",
		fullName: "Government Polytechnic, Barauni",
		branches: [
			{ branch: 14, seats: 60 }, // Chemical
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 48, seats: 60 }, // Fire Tech. & Safety
		],
	},
	{
		code: 112,
		type: CollegeType.GOVT,
		shortName: "GP Bhagalpur",
		fullName: "Government Polytechnic, Bhagalpur",
		branches: [
			{ branch: 11, seats: 60 }, // Agricultural
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 28, seats: 60 }, // Textile
		],
	},
	{
		code: 113,
		type: CollegeType.GOVT,
		shortName: "GP Chhapra",
		fullName: "Government Polytechnic, Chapra",
		branches: [
			{ branch: 12, seats: 60 }, // Automobile
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 114,
		type: CollegeType.GOVT,
		shortName: "GP Darbhanga",
		fullName: "Government Polytechnic, Darbhanga",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 115,
		type: CollegeType.GOVT,
		shortName: "GP Gaya",
		fullName: "Government Polytechnic, Gaya",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 28, seats: 30 }, // Textile
			{ branch: 71, seats: 60 }, // Information Technology
		],
	},
	{
		code: 116,
		type: CollegeType.GOVT,
		shortName: "GP Gopalganj",
		fullName: "Government Polytechnic, Gopalganj",
		branches: [
			{ branch: 15, seats: 60, extraSeats: 5 }, // Civil
			{ branch: 16, seats: 60, extraSeats: 5 }, // Civil (Rural)
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60, extraSeats: 5 }, // Electrical
			{ branch: 21, seats: 60, extraSeats: 5 }, // Electronics
			{ branch: 25, seats: 60, extraSeats: 5 }, // Mechanical
		],
	},
	{
		code: 117,
		type: CollegeType.GOVT,
		shortName: "GP Muzaffarpur",
		fullName: "Government Polytechnic, Muzaffarpur",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 72, seats: 30 }, // Leather Tech.
		],
	},
	{
		code: 118,
		type: CollegeType.GOVT,
		shortName: "GP Patna-7",
		fullName: "Government Polytechnic, Patna - 7",
		branches: [
			{ branch: 13, seats: 30 }, // Ceramics
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 27, seats: 30 }, // Printing Tech.
			{ branch: 28, seats: 30 }, // Textile
		],
	},
	{
		code: 119,
		type: CollegeType.GOVT,
		shortName: "GP Purnea",
		fullName: "Government Polytechnic, Purnea",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 120,
		type: CollegeType.GOVT,
		shortName: "GP Saharsa",
		fullName: "Government Polytechnic, Saharsa",
		branches: [
			{ branch: 12, seats: 30 }, // Automobile
			{ branch: 15, seats: 90, extraSeats: 5 }, // Civil
			{ branch: 18, seats: 60, extraSeats: 5 }, // CSE
			{ branch: 20, seats: 60, extraSeats: 5 }, // Electrical
			{ branch: 21, seats: 60, extraSeats: 10 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 121,
		type: CollegeType.GOVT,
		shortName: "NGP Patna-13",
		fullName: "New Government Polytechnic, Patna - 13",
		branches: [
			{ branch: 15, seats: 120, extraSeats: 5 }, // Civil
			{ branch: 18, seats: 60, extraSeats: 10 }, // CSE
			{ branch: 20, seats: 90, extraSeats: 5 }, // Electrical
			{ branch: 21, seats: 120, extraSeats: 5 }, // Electronics
			{ branch: 25, seats: 120 }, // Mechanical
			{ branch: 33, seats: 60 }, // Mechanical (Automobile)
		],
	},
	{
		code: 122,
		type: CollegeType.GOVT,
		shortName: "GWP Muzaffarpur",
		fullName: "Government Women's Polytechnic, Muzaffarpur",
		branches: [
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 90 }, // CSE
			{ branch: 49, seats: 30 }, // Food Processing & Preservation
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 20, seats: 90 }, // Electrical
		],
	},
	{
		code: 123,
		type: CollegeType.GOVT,
		shortName: "GWP Patna",
		fullName: "Government Women's Polytechnic, Patna",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 26, seats: 30 }, // Modern Office Practice
			{ branch: 41, seats: 30 }, // Library & Info Science
		],
	},
	{
		code: 124,
		type: CollegeType.GOVT,
		shortName: "GP Katihar",
		fullName: "Government Polytechnic, Katihar",
		branches: [
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 125,
		type: CollegeType.GOVT,
		shortName: "GP Vaishali",
		fullName: "Government Polytechnic, Vaishali",
		branches: [
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 45, seats: 60 }, // Civil (Construction Tech.)
			{ branch: 72, seats: 30 }, // Leather Tech.
		],
	},
	{
		code: 126,
		type: CollegeType.GOVT,
		shortName: "GP Lakhisarai",
		fullName: "Government Polytechnic, Lakhisarai",
		branches: [
			{ branch: 15, seats: 30 }, // Civil
			{ branch: 20, seats: 30 }, // Electrical
			{ branch: 21, seats: 30 }, // Electronics
			{ branch: 25, seats: 30 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 127,
		type: CollegeType.GOVT,
		shortName: "GP Dehrionsone",
		fullName: "Government Polytechnic, Dehrionsone",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 128,
		type: CollegeType.GOVT,
		shortName: "GP Asthawan, Nalanda",
		fullName: "Government Polytechnic, Asthawan, Nalanda",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 129,
		type: CollegeType.GOVT,
		shortName: "GP Sheohar",
		fullName: "Government Polytechnic, Sheohar",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 130,
		type: CollegeType.GOVT,
		shortName: "GP Motihari",
		fullName: "Government Polytechnic, Motihari",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 131,
		type: CollegeType.GOVT,
		shortName: "GP Madhubani",
		fullName: "Government Polytechnic, Madhubani",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 132,
		type: CollegeType.GOVT,
		shortName: "BKPI Sitamarhi",
		fullName: "Baddiuzama Khan Polytechnic Institute, Sitamarhi",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
		],
	},
	{
		code: 133,
		type: CollegeType.GOVT,
		shortName: "GP Madhepura",
		fullName: "Government Polytechnic, Madhepura",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 134,
		type: CollegeType.GOVT,
		shortName: "GP Raghopur, Supaul",
		fullName: "Government Polytechnic, Raghopur, Supaul",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 135,
		type: CollegeType.GOVT,
		shortName: "KNSGP Samastipur",
		fullName: "Kameshwar Narayan Singh Government Polytechnic, Samastipur",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 136,
		type: CollegeType.GOVT,
		shortName: "BKNSGP Gopalganj",
		fullName: "Braj Kishor Narayan Singh Government Polytechnic, Gopalganj",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 137,
		type: CollegeType.GOVT,
		shortName: "GP Munger",
		fullName: "Government Polytechnic, Munger",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 48, seats: 60 }, // Fire Tech. & Safety
		],
	},
	{
		code: 138,
		type: CollegeType.GOVT,
		shortName: "GP Sheikhpura",
		fullName: "Government Polytechnic, Sheikhpura",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 139,
		type: CollegeType.GOVT,
		shortName: "GP Jamui",
		fullName: "Government Polytechnic, Jamui",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 140,
		type: CollegeType.GOVT,
		shortName: "GP Banka",
		fullName: "Government Polytechnic, Banka",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 141,
		type: CollegeType.GOVT,
		shortName: "GP Tekari, Gaya",
		fullName: "Government Polytechnic, Tekari, Gaya",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 142,
		type: CollegeType.GOVT,
		shortName: "GP Kaimur",
		fullName: "Government Polytechnic, Kaimur",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 143,
		type: CollegeType.GOVT,
		shortName: "GP Buxar",
		fullName: "Government Polytechnic, Buxar",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 144,
		type: CollegeType.GOVT,
		shortName: "GP Sitamarhi",
		fullName: "Government Polytechnic, Sitamarhi",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 145,
		type: CollegeType.GOVT,
		shortName: "GP West Champaran",
		fullName: "Government Polytechnic, West Champaran",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 146,
		type: CollegeType.GOVT,
		shortName: "GP Kishanganj",
		fullName: "Government Polytechnic, Kishanganj",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 30 }, // CSE
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 147,
		type: CollegeType.GOVT,
		shortName: "GP Araria",
		fullName: "Government Polytechnic, Araria",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 148,
		type: CollegeType.GOVT,
		shortName: "GP Nawada",
		fullName: "Government Polytechnic, Nawada",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 18, seats: 30 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 47, seats: 60 }, // Mining
		],
	},
	{
		code: 149,
		type: CollegeType.GOVT,
		shortName: "GP Siwan",
		fullName: "Government Polytechnic, Siwan",
		branches: [
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
		],
	},
	{
		code: 150,
		type: CollegeType.GOVT,
		shortName: "GP Arwal",
		fullName: "Government Polytechnic, Arwal",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 21, seats: 60 }, // Electronics
		],
	},
	{
		code: 151,
		type: CollegeType.GOVT,
		shortName: "GP Aurangabad",
		fullName: "Government Polytechnic, Aurangabad",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 152,
		type: CollegeType.GOVT,
		shortName: "GP Bhojpur",
		fullName: "Government Polytechnic, Bhojpur",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 21, seats: 60 }, // Electronics
		],
	},
	{
		code: 153,
		type: CollegeType.GOVT,
		shortName: "GP Jehanabad",
		fullName: "Government Polytechnic, Jehanabad",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 120 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 154,
		type: CollegeType.GOVT,
		shortName: "GP Khagaria",
		fullName: "Government Polytechnic, Khagaria",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 155,
		type: CollegeType.GOVT,
		shortName: "GP Barh",
		fullName: "Government Polytechnic, Barh",
		branches: [
			{ branch: 43, seats: 60 }, // Electronics (Robotics)
			{ branch: 44, seats: 60 }, // AI & ML
			{ branch: 45, seats: 60 }, // Civil (Construction Tech.)
			{ branch: 46, seats: 60 }, // Mechanical (CAD/CAM)
		],
	},
	{
		code: 156,
		type: CollegeType.GOVT,
		shortName: "GPTT Bhagalpur",
		fullName: "Government Textile Technology Institute, Bhagalpur",
		branches: [
			{ branch: 50, seats: 45 }, // Costume Design & Dress Making
			{ branch: 51, seats: 45 }, // Fashion & Clothing Tech.
			{ branch: 52, seats: 45 }, // Garment Tech.
			{ branch: 53, seats: 45 }, // Textile Tech.
			{ branch: 15, seats: 45 }, // Civil
		],
	},
	{
		code: 172,
		type: CollegeType.PRIVATE,
		shortName: "Azmet College of Engg. and Tech.",
		fullName: "Azmet College of Engineering and Technology, Kishanganj",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 25, seats: 90 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 173,
		type: CollegeType.PRIVATE,
		shortName: "Millia Poly. (Purnea)",
		fullName: "Millia Polytechnic, Purnea",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 30 }, // Electrical & Electronics
		],
	},
	{
		code: 174,
		type: CollegeType.PRIVATE,
		shortName: "Buddha Inst. of Tech.",
		fullName: "Buddha Institute of Technology, Gaya",
		branches: [
			{ branch: 15, seats: 108 }, // Civil
			{ branch: 18, seats: 45 }, // CSE
			{ branch: 20, seats: 81 }, // Electrical
			{ branch: 44, seats: 27 }, // AI & ML
		],
	},
	{
		code: 178,
		type: CollegeType.PRIVATE,
		shortName: "Sityog Inst. of Tech.",
		fullName: "Sityog Inst. of Tech., Aurangabad",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 120 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 179,
		type: CollegeType.PRIVATE,
		shortName: "Shri Ram Poly.",
		fullName: "Shri Ram Polytechnic, Madhubani",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 185,
		type: CollegeType.PRIVATE,
		shortName: "C.R.K. Poly.",
		fullName: "C. R. K. Polytechnic, Hajipur",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 187,
		type: CollegeType.PRIVATE,
		shortName: "Netaji Subhash Inst. of Tech.",
		fullName: "Netaji Subhash Institute of Technology, Bihta",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 25, seats: 120 }, // Mechanical
			{ branch: 39, seats: 60 }, // Electrical & Electronics
		],
	},
	{
		code: 188,
		type: CollegeType.PRIVATE,
		shortName: "Ganga Mem. College of Poly.",
		fullName: "Ganga Memorial College of Polytechnic, Harnaut",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 18, seats: 90 }, // CSE
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 21, seats: 30 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 189,
		type: CollegeType.PRIVATE,
		shortName: "Netaji Subhas Inst. of Poly.",
		fullName: "Netaji Subhas Instt. of Poly., Bihta",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 120 }, // Mechanical
		],
	},
	{
		code: 190,
		type: CollegeType.PRIVATE,
		shortName: "Exalt College of Poly.",
		fullName: "Exalt College of Polytechnic, Vaishali",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 30 }, // Mechanical
			{ branch: 33, seats: 30 }, // Mechanical (Automobile)
			{ branch: 67, seats: 120 }, // Computer Science
		],
	},
	{
		code: 191,
		type: CollegeType.PRIVATE,
		shortName: "R.P. Sharma Inst. of Tech.",
		fullName: "R.P. Sharma Institute of Technology, Danapur, Patna",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 192,
		type: CollegeType.PRIVATE,
		shortName: "Prabhu Kailash Poly.",
		fullName: "Prabhu Kailash Polytechnic, Aurangabad",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 60 }, // Electrical & Electronics
		],
	},
	{
		code: 193,
		type: CollegeType.PRIVATE,
		shortName: "Millia Inst. of Tech.",
		fullName: "Millia Institute of Technology, Rambagh, Purnea",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 195,
		type: CollegeType.PRIVATE,
		shortName: "Millia Poly. (Veriadangi)",
		fullName: "Millia Polytechnic, Veriadangi, Kishanganj",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 197,
		type: CollegeType.PRIVATE,
		shortName: "Satyam Intl. Inst. of Tech.",
		fullName: "Satyam International Institute of Technology, Gaurichak, Patna",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 60 }, // Electrical & Electronics
		],
	},
	{
		code: 198,
		type: CollegeType.PRIVATE,
		shortName: "J.P. Inst. of Tech.",
		fullName: "J.P. Institute of Technology, Biharsharif, Nalanda",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 30 }, // Electrical & Electronics
		],
	},
	{
		code: 199,
		type: CollegeType.PRIVATE,
		shortName: "GEMS Poly. College",
		fullName: "GEMS Polytechnic College, Aurangabad",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 60 }, // Electrical & Electronics
		],
	},
	{
		code: 200,
		type: CollegeType.PRIVATE,
		shortName: "Girija Devi Poly. College",
		fullName: "Girija Devi Polytechnic College, Bihiya, Bhojpur",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 120 }, // Mechanical
		],
	},
	{
		code: 201,
		type: CollegeType.PRIVATE,
		shortName: "Jamui Poly.",
		fullName: "Jamui Polytechnic, Jamui",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 203,
		type: CollegeType.PRIVATE,
		shortName: "Hi Tech Poly. College",
		fullName: "Hi Tech Polytechnic College, Bettiah",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 38, seats: 60 }, // ECE
		],
	},
	{
		code: 204,
		type: CollegeType.PRIVATE,
		shortName: "Chanakya Inst. of Poly. and Tech.",
		fullName: "Chanakya Inst. of Polytechnic and Tech., Koilwar, Bhojpur",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 205,
		type: CollegeType.PRIVATE,
		shortName: "Aryabhatt Poly.",
		fullName: "Aryabhatt Polytechnic, Gaya",
		branches: [
			{ branch: 15, seats: 180 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 206,
		type: CollegeType.PRIVATE,
		shortName: "Mothers Inst. of Tech.",
		fullName: "Mothers Institute of Technology, Bihta",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 60 }, // Electrical & Electronics
		],
	},
	{
		code: 208,
		type: CollegeType.PRIVATE,
		shortName: "Mamta Inst. of Edu.",
		fullName: "Mamta Institute of Education, Siwan",
		branches: [
			{ branch: 15, seats: 180 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 209,
		type: CollegeType.PRIVATE,
		shortName: "Maalik Inst. of Tech.",
		fullName: "Maalik Institute of Technology, Gaya",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 120 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 68, seats: 60 }, // Microelectronics & VLSI
		],
	},
	{
		code: 210,
		type: CollegeType.PRIVATE,
		shortName: "Maulana Azad College of Engg. & Tech.",
		fullName: "Maulana Azad College of Engineering & Technology, Neora Patna",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
		],
	},
	{
		code: 212,
		type: CollegeType.PRIVATE,
		shortName: "Muzaffarpur College of Prof. Edu.",
		fullName: "Muzaffarpur College of Professional Education, Muzaffarpur",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 213,
		type: CollegeType.PRIVATE,
		shortName: "Rajeev College of Prof. Edu.",
		fullName: "Rajeev College of Professional Education, Sitamarhi",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 214,
		type: CollegeType.PRIVATE,
		shortName: "Subhash Inst. of Tech.",
		fullName: "Subhash Institute of Technology, Jamui",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 30 }, // Electrical & Electronics
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 215,
		type: CollegeType.PRIVATE,
		shortName: "SNS Vidyapeeth",
		fullName: "SNS Vidyapeeth, Motihari",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 90 }, // CSE
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 69, seats: 30 }, // EV Technology
			{ branch: 70, seats: 30 }, // Renewable Energy
		],
	},
	{
		code: 216,
		type: CollegeType.PRIVATE,
		shortName: "Champaran Group of Institutions",
		fullName: "Champaran Group of Institutions, West Champaran",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 18, seats: 90 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 70, seats: 60 }, // Renewable Energy
		],
	},
	{
		code: 217,
		type: CollegeType.PRIVATE,
		shortName: "Maharana Pratap Inst. of Tech.",
		fullName: "Maharana Pratap Institute of Technology, Buxar",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 25, seats: 120 }, // Mechanical
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 218,
		type: CollegeType.PRIVATE,
		shortName: "Maa Kamakhya Poly.",
		fullName: "Maa Kamakhya Polytechnic, Ramdihra, Rohtas",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 30 }, // Electrical & Electronics
			{ branch: 66, seats: 30 }, // Artificial Intelligence
			{ branch: 69, seats: 30 }, // EV Technology
		],
	},
	{
		code: 219,
		type: CollegeType.PRIVATE,
		shortName: "RIMU Inst. of Tech.",
		fullName: "RIMU Institute of Technology, Pant Nagar Gaya",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 220,
		type: CollegeType.PRIVATE,
		shortName: "Lichavi Inst. of Prof. Studies",
		fullName: "Lichavi Institute of Professional Studies, Muzaffarpur",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 221,
		type: CollegeType.PRIVATE,
		shortName: "Magadh Inst. of Tech.",
		fullName: "Magadh Institute of Technology, Nasriganj, Patna",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 30 }, // Mechanical
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 222,
		type: CollegeType.PRIVATE,
		shortName: "Champaran College of Prof. Edu.",
		fullName: "Champaran College of Professional Education, East Champaran",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 30 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 223,
		type: CollegeType.PRIVATE,
		shortName: "Dr. Ashok Gagan College",
		fullName: "Dr. Ashok Gagan College, Bihta, Patna",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 38, seats: 30 }, // ECE
			{ branch: 66, seats: 15 }, // Artificial Intelligence
		],
	},
	{
		code: 224,
		type: CollegeType.PRIVATE,
		shortName: "Sityog Inst. of Poly.",
		fullName: "Sityog Institute of Polytechnic, Aurangabad",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 18, seats: 90 }, // CSE
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 25, seats: 30 }, // Mechanical
			{ branch: 48, seats: 30 }, // Fire Tech. & Safety
		],
	},
	{
		code: 225,
		type: CollegeType.PRIVATE,
		shortName: "Arjun College of Tech. Edu.",
		fullName: "Arjun College of Technical Education, Naugachia, Bhagalpur",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 120 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 38, seats: 30 }, // ECE
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 226,
		type: CollegeType.PRIVATE,
		shortName: "Champaran College",
		fullName: "Champaran College, Bagha, West Champaran",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 90 }, // Mechanical
			{ branch: 39, seats: 90 }, // Electrical & Electronics
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 227,
		type: CollegeType.PRIVATE,
		shortName: "Divine Inst. of Tech.",
		fullName: "Divine Institute of Technology, Siwan",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 228,
		type: CollegeType.PRIVATE,
		shortName: "Ekalavya Inst. of Higher Edu.",
		fullName: "Ekalavya Institute of Higher Education, Madhepura",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 120 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 229,
		type: CollegeType.PRIVATE,
		shortName: "Himalaya Inst. of Tech.",
		fullName: "Himalaya Institute of Technology, Ebrahimpur, Awadhara, Patna",
		branches: [
			{ branch: 15, seats: 180 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 230,
		type: CollegeType.PRIVATE,
		shortName: "Kanhaiya Mem. College of Higher Edu.",
		fullName: "Kanhaiya Memorial College of Higher Education, Gaya",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 231,
		type: CollegeType.PRIVATE,
		shortName: "Kinesis Inst. of Tech.",
		fullName: "Kinesis Institute of Technology, Masaurhi, Patna",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 67, seats: 60 }, // Computer Science
			{ branch: 21, seats: 60 }, // Electronics
		],
	},
	{
		code: 232,
		type: CollegeType.PRIVATE,
		shortName: "Kusumraj Educational Inst.",
		fullName: "Kusumraj Educational Institution, Bikram, Patna",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 233,
		type: CollegeType.PRIVATE,
		shortName: "Maa Kanti College of Higher Edu.",
		fullName: "Maa Kanti College of Higher Education, Fatwah, Patna",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 234,
		type: CollegeType.PRIVATE,
		shortName: "Rungta Inst. of Tech. and Mgmt.",
		fullName: "Rungta Institute of Technology and Management, Forbesganj, Araria",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 18, seats: 90 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 44, seats: 60 }, // AI & ML
			{ branch: 48, seats: 60 }, // Fire Tech. & Safety
		],
	},
	{
		code: 235,
		type: CollegeType.PRIVATE,
		shortName: "Vidya Edu. Group",
		fullName: "Vidya Education Group, Masaurhi, Patna",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 236,
		type: CollegeType.PRIVATE,
		shortName: "Vivekanand Inst. of Tech.",
		fullName: "Vivekanand Institute of Technology, Naubatpur, Patna",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 239,
		type: CollegeType.PRIVATE,
		shortName: "Gurudeo College of Tech. and Mgmt.",
		fullName: "Gurudeo College of Technology and Management",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 44, seats: 60 }, // AI & ML
			{ branch: 74, seats: 60 }, // Electronics Comm. & Instr.
			{ branch: 75, seats: 60 }, // Electronics & Electrical
		],
	},
	{
		code: 240,
		type: CollegeType.PRIVATE,
		shortName: "Nexus Inst. of Tech.",
		fullName: "Nexus Institute of Technology",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 44, seats: 30 }, // AI & ML
			{ branch: 18, seats: 30 }, // CSE
		],
	},
	{
		code: 241,
		type: CollegeType.PRIVATE,
		shortName: "Satyam Inst. of Tech.",
		fullName: "Satyam Institute of Technology",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 60 }, // Electrical & Electronics
		],
	},
	{
		code: 242,
		type: CollegeType.PRIVATE,
		shortName: "Baba Heera Singh Deepa Singh Jee College",
		fullName: "Baba Heera Singh Deepa Singh Jee College of Higher Education",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 243,
		type: CollegeType.PRIVATE,
		shortName: "Akash Poly. College",
		fullName: "Akash Polytechnic College",
		branches: [
			{ branch: 15, seats: 180 }, // Civil
			{ branch: 18, seats: 30 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 30 }, // Mechanical
			{ branch: 39, seats: 30 }, // Electrical & Electronics
			{ branch: 69, seats: 30 }, // EV Technology
		],
	},
	{
		code: 244,
		type: CollegeType.PRIVATE,
		shortName: "Krishna Inst. of Tech.",
		fullName: "Krishna Institute of Technology",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 245,
		type: CollegeType.PRIVATE,
		shortName: "Awadhesh Sharma Inst. of Tech.",
		fullName: "Awadhesh Sharma Institute of Technology",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 246,
		type: CollegeType.PRIVATE,
		shortName: "Patliputra Inst. of Mgmt. and Tech.",
		fullName: "Patliputra Institute of Management and Technology",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 247,
		type: CollegeType.PRIVATE,
		shortName: "RDS Inst. of Tech.",
		fullName: "RDS Institute of Technology",
		branches: [
			{ branch: 14, seats: 30 }, // Chemical
			{ branch: 15, seats: 150 }, // Civil
			{ branch: 18, seats: 30 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 47, seats: 30 }, // Mining
		],
	},
	{
		code: 248,
		type: CollegeType.PRIVATE,
		shortName: "Damyanti Devi Poly. College",
		fullName: "Damyanti Devi Polytechnic College",
		branches: [
			{ branch: 15, seats: 180 }, // Civil
			{ branch: 18, seats: 30 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 30 }, // Mechanical
			{ branch: 39, seats: 30 }, // Electrical & Electronics
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 249,
		type: CollegeType.PRIVATE,
		shortName: "Aryaman Higher Edu.",
		fullName: "Aryaman Higher Education",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 250,
		type: CollegeType.PRIVATE,
		shortName: "R L Poly. College",
		fullName: "R L Polytechnic College",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 251,
		type: CollegeType.PRIVATE,
		shortName: "Shanti Niketan Inst. of Tech.",
		fullName: "Shanti Niketan Institute of Technology",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 252,
		type: CollegeType.PRIVATE,
		shortName: "Ram Pratap Inst. of Higher Edu.",
		fullName: "Ram Pratap Institute of Higher Education",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 60 }, // Electrical & Electronics
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 253,
		type: CollegeType.PRIVATE,
		shortName: "Amrath Tech. College",
		fullName: "Amrath Technical College",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 120 }, // Electrical
			{ branch: 25, seats: 30 }, // Mechanical
			{ branch: 48, seats: 30 }, // Fire Tech. & Safety
		],
	},
	{
		code: 254,
		type: CollegeType.PRIVATE,
		shortName: "Gyansarover Inst. of Mgmt. and Tech.",
		fullName: "Gyansarover Institute of Management and Technology",
		branches: [
			{ branch: 15, seats: 180 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 66, seats: 30 }, // Artificial Intelligence
			{ branch: 69, seats: 30 }, // EV Technology
		],
	},
	{
		code: 255,
		type: CollegeType.PRIVATE,
		shortName: "Mona Poly. College",
		fullName: "Mona Polytechnic College",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
		],
	},
	{
		code: 256,
		type: CollegeType.PRIVATE,
		shortName: "Ram Sharan Roy College of Tech.",
		fullName: "Ram Sharan Roy College of Technology",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 38, seats: 60 }, // ECE
			{ branch: 67, seats: 60 }, // Computer Science
			{ branch: 73, seats: 60 }, // Computer Science & IT
		],
	},
	{
		code: 257,
		type: CollegeType.PRIVATE,
		shortName: "Sir BD Singh Inst. of Tech.",
		fullName: "Sir BD Singh Institute of Technology",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
			{ branch: 56, seats: 60 }, // Computer Engg.
		],
	},
	{
		code: 258,
		type: CollegeType.PRIVATE,
		shortName: "Sunaina Poly. College",
		fullName: "Sunaina Polytechnic College, Lakhisarai",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 48, seats: 60 }, // Fire Tech. & Safety
			{ branch: 66, seats: 30 }, // Artificial Intelligence
			{ branch: 76, seats: 60 }, // Medical Lab. Tech.
		],
	},
	{
		code: 259,
		type: CollegeType.PRIVATE,
		shortName: "SNB College of Edu.",
		fullName: "SNB College of Education",
		branches: [
			{ branch: 15, seats: 90 }, // Civil
			{ branch: 67, seats: 90 }, // Computer Science
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 260,
		type: CollegeType.PRIVATE,
		shortName: "Oxford College of Research and Tech.",
		fullName: "Oxford College of Research and Technology",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 261,
		type: CollegeType.PRIVATE,
		shortName: "Maa Saraswati College of Engg. and Tech.",
		fullName: "Maa Saraswati College of Engineering and Technology",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 262,
		type: CollegeType.PRIVATE,
		shortName: "P.J. Inst. of Higher Edu.",
		fullName: "P.J. Institute of Higher Education",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 90 }, // CSE
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 263,
		type: CollegeType.PRIVATE,
		shortName: "VTIT College",
		fullName: "VTIT College",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 90 }, // Mechanical
			{ branch: 44, seats: 60 }, // AI & ML
		],
	},
	{
		code: 264,
		type: CollegeType.PRIVATE,
		shortName: "Bhagwati Trishuldhari College of Tech.",
		fullName: "Bhagwati Trishuldhari College of Technology",
		branches: [
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 39, seats: 60 }, // Electrical & Electronics
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 44, seats: 60 }, // AI & ML
		],
	},
	{
		code: 265,
		type: CollegeType.PRIVATE,
		shortName: "R S Inst. of Higher Edu.",
		fullName: "R S Institute of Higher Education",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 266,
		type: CollegeType.PRIVATE,
		shortName: "Nilimarjun College of Poly.",
		fullName: "Nilimarjun College of Polytechnic",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 69, seats: 30 }, // EV Technology
		],
	},
	{
		code: 267,
		type: CollegeType.PRIVATE,
		shortName: "Sheikhpura Inst.",
		fullName: "Sheikhpura Institute Sheikhpura",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 18, seats: 120 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 268,
		type: CollegeType.PRIVATE,
		shortName: "Maa Kalmi College of Poly.",
		fullName: "Maa Kalmi College of Polytechnic",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 90 }, // Electrical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 69, seats: 30 }, // EV Technology
		],
	},
	{
		code: 269,
		type: CollegeType.PRIVATE,
		shortName: "S.N. Thakur Poly. College",
		fullName: "S.N Thakur Polytechnic College",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
	{
		code: 270,
		type: CollegeType.PRIVATE,
		shortName: "Basundhara Poly. College",
		fullName: "Basundhara Polytechnic College",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 38, seats: 60 }, // ECE
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 271,
		type: CollegeType.PRIVATE,
		shortName: "Ram Lagan Rai College of Tech.",
		fullName: "Ram Lagan Rai College of Technology",
		branches: [
			{ branch: 15, seats: 60 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 39, seats: 60 }, // Electrical & Electronics
			{ branch: 46, seats: 60 }, // Mechanical (CAD/CAM)
			{ branch: 44, seats: 60 }, // AI & ML
		],
	},
	{
		code: 272,
		type: CollegeType.PRIVATE,
		shortName: "SIMS Prof. College",
		fullName: "SIMS Professional College",
		branches: [
			{ branch: 12, seats: 60 }, // Automobile
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 71, seats: 60 }, // Information Technology
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 273,
		type: CollegeType.PRIVATE,
		shortName: "Denali College of Mgmt. and Tech.",
		fullName: "Denali College of Management and Technology",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 120 }, // Electrical
			{ branch: 21, seats: 60 }, // Electronics
			{ branch: 67, seats: 60 }, // Computer Science
		],
	},
	{
		code: 274,
		type: CollegeType.PRIVATE,
		shortName: "Gautam College",
		fullName: "Gautam College",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 120 }, // Electrical
			{ branch: 77, seats: 120 }, // Computer Application
		],
	},
	{
		code: 275,
		type: CollegeType.PRIVATE,
		shortName: "Neelam Singh College of Tech. and Research",
		fullName: "Neelam Singh College of Technology and Research",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 56, seats: 60 }, // Computer Engg.
			{ branch: 66, seats: 60 }, // Artificial Intelligence
		],
	},
	{
		code: 276,
		type: CollegeType.PRIVATE,
		shortName: "Krishna Poly. College",
		fullName: "Krishna Polytechnic College",
		branches: [
			{ branch: 15, seats: 120 }, // Civil
			{ branch: 20, seats: 60 }, // Electrical
			{ branch: 48, seats: 30 }, // Fire Tech. & Safety
			{ branch: 25, seats: 60 }, // Mechanical
			{ branch: 18, seats: 60 }, // CSE
			{ branch: 66, seats: 30 }, // Artificial Intelligence
		],
	},
];
