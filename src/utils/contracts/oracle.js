const oracle = [
	{
		name: "ChainlinkOracle",
		id: 1,
		contractChain: "0x89",
		address: "0x69f667b326d7a4aa917040d9a4255c6549d6abd0",
		abi: [
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "get",
				outputs: [
					{ internalType: "bool", name: "", type: "bool" },
					{ internalType: "uint256", name: "", type: "uint256" },
				],
				stateMutability: "nonpayable",
				type: "function",
			},
			{
				inputs: [{ internalType: "address", name: "aggregator", type: "address" }],
				name: "getDataParam",
				outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				stateMutability: "pure",
				type: "function"
			},
			{
				inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				name: "name",
				outputs: [{ internalType: "string", name: "", type: "string" }],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "peek",
				outputs: [
					{ internalType: "bool", name: "", type: "bool" },
					{ internalType: "uint256", name: "", type: "uint256" },
				],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "peekSpot",
				outputs: [{ internalType: "uint256", name: "rate", type: "uint256" }],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				name: "symbol",
				outputs: [{ internalType: "string", name: "", type: "string" }],
				stateMutability: "view",
				type: "function",
			},
		],
		oracleData:"0x000000000000000000000000ab594600376ec9fd91f8e885dadf0ce036862de0"
	},
	{
		name: "TwapOracle",
		id: 2,
		contractChain: "0x89",
		address: "0x60df56f7151414ed3ad6c81fbb00002180aab6f4",
		abi: [
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "get",
				outputs: [
					{ internalType: "bool", name: "", type: "bool" },
					{ internalType: "uint256", name: "", type: "uint256" },
				],
				stateMutability: "nonpayable",
				type: "function",
			},
			{
				inputs: [{ internalType: "address", name: "aggregator", type: "address" }],
				name: "getDataParam",
				outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				stateMutability: "pure",
				type: "function"
			},
			{
				inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				name: "name",
				outputs: [{ internalType: "string", name: "", type: "string" }],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "peek",
				outputs: [
					{ internalType: "bool", name: "", type: "bool" },
					{ internalType: "uint256", name: "", type: "uint256" },
				],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "peekSpot",
				outputs: [{ internalType: "uint256", name: "rate", type: "uint256" }],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				name: "symbol",
				outputs: [{ internalType: "string", name: "", type: "string" }],
				stateMutability: "view",
				type: "function",
			},
		],
		oracleData: "0x000000000000000000000000f9680d99d6c9589e2a93a78a04a279e509205945"
	},
	{
		name: "ChainlinkOracle",
		id: 3,
		contractChain: "0x89",
		address: "0x69f667b326d7a4aa917040d9a4255c6549d6abd0",
		abi: [
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "get",
				outputs: [
					{ internalType: "bool", name: "", type: "bool" },
					{ internalType: "uint256", name: "", type: "uint256" },
				],
				stateMutability: "nonpayable",
				type: "function",
			},
			{
				inputs: [{ internalType: "address", name: "aggregator", type: "address" }],
				name: "getDataParam",
				outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				stateMutability: "pure",
				type: "function"
			},
			{
				inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				name: "name",
				outputs: [{ internalType: "string", name: "", type: "string" }],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "peek",
				outputs: [
					{ internalType: "bool", name: "", type: "bool" },
					{ internalType: "uint256", name: "", type: "uint256" },
				],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
				name: "peekSpot",
				outputs: [{ internalType: "uint256", name: "rate", type: "uint256" }],
				stateMutability: "view",
				type: "function",
			},
			{
				inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
				name: "symbol",
				outputs: [{ internalType: "string", name: "", type: "string" }],
				stateMutability: "view",
				type: "function",
			},
		],
		oracleData:"0x000000000000000000000000f9680d99d6c9589e2a93a78a04a279e509205945"
	}
];

export default oracle