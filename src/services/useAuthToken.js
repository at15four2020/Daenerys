function useAuthToken(token) {
    return {
        wallet: {
            current: 9999,
        },
        transactionCost: 100,
    }
}

module.exports = useAuthToken
