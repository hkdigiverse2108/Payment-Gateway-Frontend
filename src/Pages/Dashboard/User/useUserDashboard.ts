import { useMemo } from "react";
import { Queries } from "../../../Api";
import { useAppSelector } from "../../../Store";

export const useUserDashboard = () => {

    // ✅ logged-in user
    const user = useAppSelector((state) => state.auth.user);

    // adjust according to your backend
    const userId =
        user?._id ||
        user?.id ||
        user?.userId;

    // ✅ transactions API
    const {
        data: transResponse,
        isLoading: transLoading,
        refetch: refetchTrans,
    } = Queries.useGetTransaction({
        limit: 50,
    });

    // ✅ wallet API
    const {
        data: walletResponse,
        isLoading: walletLoading,
        refetch: refetchWallet,
    } = Queries.useGetWalletBalance({
        userId, // IMPORTANT
    });

    // -------------------------------------
    // RAW DATA
    // -------------------------------------

    const rawTransactions = transResponse?.data?.data ?? [];

    // -------------------------------------
    // EXTRA SAFETY FILTER
    // (frontend protection)
    // -------------------------------------

    const userTransactions = useMemo(() => {
        return rawTransactions.filter((t: any) => {

            const transactionUserId =
                t.userId ||
                t.user?._id ||
                t.user?.id;

            return String(transactionUserId) === String(userId);
        });
    }, [rawTransactions, userId]);

    // wallet balance
    const walletBalance =
        walletResponse?.data?.walletBalance ?? 0;

    // -------------------------------------
    // NORMALIZE
    // -------------------------------------

    const normalized = useMemo(() => {
        return userTransactions.map((t: any) => ({
            ...t,
            status: t.paymentStatus || t.status,
            type: t.type || "deposit",
            amount: Number(t.amount) || 0,
            createdAt: t.createdAt || new Date().toISOString(),
        }));
    }, [userTransactions]);

    // -------------------------------------
    // STATUS GROUPS
    // -------------------------------------

    const success = useMemo(
        () => normalized.filter((t) => t.status === "success"),
        [normalized]
    );

    const pending = useMemo(
        () => normalized.filter((t) => t.status === "pending"),
        [normalized]
    );

    const failed = useMemo(
        () => normalized.filter((t) => t.status === "failed"),
        [normalized]
    );

    // -------------------------------------
    // METRICS
    // -------------------------------------

    const totalTrans = normalized.length;

    const totalSpent = useMemo(() => {
        return success.reduce(
            (sum, t) => sum + t.amount,
            0
        );
    }, [success]);

    const pendingCount = pending.length;

    const successRate = totalTrans
        ? Math.round((success.length / totalTrans) * 100)
        : 0;

    const avgTxn = useMemo(() => {
        if (!totalTrans) return 0;

        const sum = normalized.reduce(
            (s, t) => s + t.amount,
            0
        );

        return Math.round(sum / totalTrans);
    }, [normalized, totalTrans]);

    const maxTxn = useMemo(() => {
        if (!totalTrans) return 0;

        return Math.max(
            ...normalized.map((t) => t.amount)
        );
    }, [normalized, totalTrans]);

    // -------------------------------------
    // CASHFLOW
    // -------------------------------------

    const {
        cashflowData,
        totalDeposit,
        totalWithdraw,
    } = useMemo(() => {

        const map = new Map<
            string,
            {
                deposit: number;
                withdraw: number;
            }
        >();

        normalized.forEach((t) => {

            const date = new Date(
                t.createdAt
            ).toLocaleDateString();

            if (!map.has(date)) {
                map.set(date, {
                    deposit: 0,
                    withdraw: 0,
                });
            }

            const entry = map.get(date)!;

            if (t.type === "withdraw") {
                entry.withdraw += t.amount;
            } else {
                entry.deposit += t.amount;
            }
        });

        const flat: any[] = [];

        let dep = 0;
        let wit = 0;

        map.forEach((e, d) => {

            flat.push({
                date: d,
                value: e.deposit,
                type: "deposit",
            });

            flat.push({
                date: d,
                value: e.withdraw,
                type: "withdraw",
            });

            dep += e.deposit;
            wit += e.withdraw;
        });

        return {
            cashflowData: flat,
            totalDeposit: dep,
            totalWithdraw: wit,
        };

    }, [normalized]);

    // -------------------------------------
    // STATUS CHART
    // -------------------------------------

    const statusData = useMemo(
        () => [
            {
                name: "Success",
                value: success.length,
            },
            {
                name: "Pending",
                value: pending.length,
            },
            {
                name: "Failed",
                value: failed.length,
            },
        ],
        [success, pending, failed]
    );

    return {
        transactions: normalized,

        walletBalance,

        totalTrans,
        totalSpent,
        pendingCount,
        successRate,
        avgTxn,
        maxTxn,

        cashflowData,
        statusData,

        totalRevenue: totalDeposit,
        totalDeposit,
        totalWithdraw,

        // user dashboard only
        activeUsers: 1,

        pendingPayments: pendingCount,

        loading:
            transLoading || walletLoading,

        refetch: () => {
            refetchTrans?.();
            refetchWallet?.();
        },
    };
};