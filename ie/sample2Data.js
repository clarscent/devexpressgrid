let sample2 = [
	{
		"ID": 1,
		"FirstName": "John",
		"LastName": "Heart",
		"Prefix": "Mr.",
		"Position": "CTO",
		"SelectBox1": 1,
		"SelectBox2": 3,
		"SelectBox3": 5
	}, {
		"ID": 2,
		"FirstName": "Olivia",
		"LastName": "Peyton",
		"Prefix": "Mrs.",
		"Position": "HR Manager",
		"SelectBox1": 2,
		"SelectBox2": 4,
		"SelectBox3": 7
	}, {
		"ID": 3,
		"FirstName": "Robert",
		"LastName": "Reagan",
		"Prefix": "Mr.",
		"Position": "IT Manager",
		"SelectBox1": 3,
		"SelectBox2": 7,
		"SelectBox3": 14
	}, {
		"ID": 4,
		"FirstName": "Greta",
		"LastName": "Sims",
		"Prefix": "Ms.",
		"Position": "Shipping Manager",
		"SelectBox1": 4,
		"SelectBox2": 12,
		"SelectBox3": 23
	}, {
		"ID": 5,
		"FirstName": "Brett",
		"LastName": "Wade",
		"Prefix": "Mr.",
		"Position": "Shipping Manager",
		"SelectBox1": 5,
		"SelectBox2": 15,
		"SelectBox3": 30
	}, {
		"ID": 6,
		"FirstName": "Sandra",
		"LastName": "Johnson",
		"Prefix": "Mrs.",
		"Position": "Network Admin",
		"SelectBox1": 6,
		"SelectBox2": 16,
		"SelectBox3": 32
	}, {
		"ID": 7,
		"FirstName": "Kevin",
		"LastName": "Carter",
		"Prefix": "Mr.",
		"Position": "Network Admin",
		"SelectBox1": 7,
		"SelectBox2": 19,
		"SelectBox3": 37
	}, {
		"ID": 8,
		"FirstName": "Cynthia",
		"LastName": "Stanwick",
		"Prefix": "Ms.",
		"Position": "Sales Assistant",
		"SelectBox1": 1,
		"SelectBox2": 2,
		"SelectBox3": 4
	}, {
		"ID": 9,
		"FirstName": "Kent",
		"LastName": "Samuelson",
		"Prefix": "Dr.",
		"Position": "Sales Assistant",
		"SelectBox1": 2,
		"SelectBox2": 6,
		"SelectBox3": 11
	}, {
		"ID": 10,
		"FirstName": "Taylor",
		"LastName": "Riley",
		"Prefix": "Mr.",
		"Position": "Support Assistant",
		"SelectBox1": 3,
		"SelectBox2": 9,
		"SelectBox3": 17
	}, {
		"ID": 11,
		"FirstName": "Sam",
		"LastName": "Hill",
		"Prefix": "Mr.",
		"Position": "Sales Assistant",
		"SelectBox1": 4,
		"SelectBox2": 10,
		"SelectBox3": 20
	}, {
		"ID": 12,
		"FirstName": "Kelly",
		"LastName": "Rodriguez",
		"Prefix": "Ms.",
		"Position": "Sales Assistant",
		"SelectBox1": 5,
		"SelectBox2": 15,
		"SelectBox3": 29
	}, {
		"ID": 13,
		"FirstName": "Natalie",
		"LastName": "Maguirre",
		"Prefix": "Mrs.",
		"Position": "Sales Assistant",
		"SelectBox1": 6,
		"SelectBox2": 17,
		"SelectBox3": 33
	}, {
		"ID": 14,
		"FirstName": "Walter",
		"LastName": "Hobbs",
		"Prefix": "Mr.",
		"Position": "Support Assistant",
		"SelectBox1": 7,
		"SelectBox2": 21,
		"SelectBox3": 42
	}
];


let sb1 = [
	{"CODE": 1,"NAME": "월"},
	{"CODE": 2,"NAME": "화"},
	{"CODE": 3,"NAME": "수"},
	{"CODE": 4,"NAME": "목"},
	{"CODE": 5,"NAME": "금"},
	{"CODE": 6,"NAME": "토"},
	{"CODE": 7,"NAME": "일"},
];

let sb2 = [
	{"CODE": 1,"NAME": "월1","parentCode": 1},
	{"CODE": 2,"NAME": "월2","parentCode": 1},
	{"CODE": 3,"NAME": "월3","parentCode": 1},
	{"CODE": 4,"NAME": "화1","parentCode": 2},
	{"CODE": 5,"NAME": "화2","parentCode": 2},
	{"CODE": 6,"NAME": "화3","parentCode": 2},
	{"CODE": 7,"NAME": "수1","parentCode": 3},
	{"CODE": 8,"NAME": "수2","parentCode": 3},
	{"CODE": 9,"NAME": "수3","parentCode": 3},
	{"CODE": 10,"NAME": "목1","parentCode": 4},
	{"CODE": 11,"NAME": "목2","parentCode": 4},
	{"CODE": 12,"NAME": "목3","parentCode": 4},
	{"CODE": 13,"NAME": "금1","parentCode": 5},
	{"CODE": 14,"NAME": "금2","parentCode": 5},
	{"CODE": 15,"NAME": "금3","parentCode": 5},
	{"CODE": 16,"NAME": "토1","parentCode": 6},
	{"CODE": 17,"NAME": "토2","parentCode": 6},
	{"CODE": 18,"NAME": "토3","parentCode": 6},
	{"CODE": 19,"NAME": "일1","parentCode": 7},
	{"CODE": 20,"NAME": "일2","parentCode": 7},
	{"CODE": 21,"NAME": "일3","parentCode": 7},
];

let sb3 = [
	{"CODE": 1,"NAME": "월11","parentCode": 1},
	{"CODE": 2,"NAME": "월12","parentCode": 1},
	{"CODE": 3,"NAME": "월21","parentCode": 2},
	{"CODE": 4,"NAME": "월22","parentCode": 2},
	{"CODE": 5,"NAME": "월31","parentCode": 3},
	{"CODE": 6,"NAME": "월32","parentCode": 3},
	{"CODE": 7,"NAME": "화11","parentCode": 4},
	{"CODE": 8,"NAME": "화12","parentCode": 4},
	{"CODE": 9,"NAME": "화21","parentCode": 5},
	{"CODE": 10,"NAME": "화22","parentCode": 5},
	{"CODE": 11,"NAME": "화31","parentCode": 6},
	{"CODE": 12,"NAME": "화32","parentCode": 6},
	{"CODE": 13,"NAME": "수11","parentCode": 7},
	{"CODE": 14,"NAME": "수12","parentCode": 7},
	{"CODE": 15,"NAME": "수21","parentCode": 8},
	{"CODE": 16,"NAME": "수22","parentCode": 8},
	{"CODE": 17,"NAME": "수31","parentCode": 9},
	{"CODE": 18,"NAME": "수32","parentCode": 9},
	{"CODE": 19,"NAME": "목11","parentCode": 10},
	{"CODE": 20,"NAME": "목12","parentCode": 10},
	{"CODE": 21,"NAME": "목21","parentCode": 11},
	{"CODE": 22,"NAME": "목22","parentCode": 11},
	{"CODE": 23,"NAME": "목31","parentCode": 12},
	{"CODE": 24,"NAME": "목32","parentCode": 12},
	{"CODE": 25,"NAME": "금11","parentCode": 13},
	{"CODE": 26,"NAME": "금12","parentCode": 13},
	{"CODE": 27,"NAME": "금21","parentCode": 14},
	{"CODE": 28,"NAME": "금22","parentCode": 14},
	{"CODE": 29,"NAME": "금31","parentCode": 15},
	{"CODE": 30,"NAME": "금32","parentCode": 15},
	{"CODE": 31,"NAME": "토11","parentCode": 16},
	{"CODE": 32,"NAME": "토12","parentCode": 16},
	{"CODE": 33,"NAME": "토21","parentCode": 17},
	{"CODE": 34,"NAME": "토22","parentCode": 17},
	{"CODE": 35,"NAME": "토31","parentCode": 18},
	{"CODE": 36,"NAME": "토32","parentCode": 18},
	{"CODE": 37,"NAME": "일11","parentCode": 19},
	{"CODE": 38,"NAME": "일12","parentCode": 19},
	{"CODE": 39,"NAME": "일21","parentCode": 20},
	{"CODE": 40,"NAME": "일22","parentCode": 20},
	{"CODE": 41,"NAME": "일31","parentCode": 21},
	{"CODE": 42,"NAME": "일32","parentCode": 21},
]
