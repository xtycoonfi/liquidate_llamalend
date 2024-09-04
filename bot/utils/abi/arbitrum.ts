export const ARB_LP_ABI = [
    {
        inputs: [],
        name: "users_to_liquidate",
        outputs: [{
            components: [
                { name: "user", type: "address" },
                { name: "x", type: "uint256" },
                { name: "y", type: "uint256" },
                { name: "debt", type: "uint256" },
                { name: "health", type: "int256" }
            ],
            name: "",
            type: "tuple[]"
        }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ name: "_from", type: "uint256" }],
        name: "users_to_liquidate",
        outputs: [{
            components: [
                { name: "user", type: "address" },
                { name: "x", type: "uint256" },
                { name: "y", type: "uint256" },
                { name: "debt", type: "uint256" },
                { name: "health", type: "int256" }
            ],
            name: "",
            type: "tuple[]"
        }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { name: "_from", type: "uint256" },
            { name: "_limit", type: "uint256" }
        ],
        name: "users_to_liquidate",
        outputs: [{
            components: [
                { name: "user", type: "address" },
                { name: "x", type: "uint256" },
                { name: "y", type: "uint256" },
                { name: "debt", type: "uint256" },
                { name: "health", type: "int256" }
            ],
            name: "",
            type: "tuple[]"
        }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { name: "user", type: "address" },
            { name: "min_x", type: "uint256" }
        ],
        name: "liquidate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { name: "user", type: "address" },
            { name: "min_x", type: "uint256" },
            { name: "frac", type: "uint256" },
            { name: "callbacker", type: "address" },
            { name: "callback_args", type: "uint256[]" }
        ],
        name: "liquidate_extended",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
];