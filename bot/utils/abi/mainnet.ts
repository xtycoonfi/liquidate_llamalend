export const ETH_LP_ABI = [
    {
        constant: true,
        inputs: [],
        name: "users_to_liquidate",
        outputs: [{ name: "", type: "tuple[]" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "_from", type: "uint256" }],
        name: "users_to_liquidate",
        outputs: [{ name: "", type: "tuple[]" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [
            { name: "_from", type: "uint256" },
            { name: "_limit", type: "uint256" }
        ],
        name: "users_to_liquidate",
        outputs: [{ name: "", type: "tuple[]" }],
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "user", type: "address" },
            { name: "min_x", type: "uint256" }
        ],
        name: "liquidate",
        outputs: [],
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "user", type: "address" },
            { name: "min_x", type: "uint256" },
            { name: "use_eth", type: "bool" }
        ],
        name: "liquidate",
        outputs: [],
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "user", type: "address" },
            { name: "min_x", type: "uint256" },
            { name: "frac", type: "uint256" },
            { name: "use_eth", type: "bool" },
            { name: "callbacker", type: "address" },
            { name: "callback_args", type: "uint256[]" }
        ],
        name: "liquidate_extended",
        outputs: [],
        type: "function",
    }
]