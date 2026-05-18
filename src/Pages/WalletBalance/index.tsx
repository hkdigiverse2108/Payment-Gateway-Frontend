import { useMemo, useState } from "react";
import { Queries } from "../../Api";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { Wallet } from "../../Components/Wallet";
import CommonLoader from "../../Components/Common/CommonLoader";

const WalletBalance = () => {
  const { data: balanceData } = Queries.useGetWalletBalance();
  const { data: activityData, isLoading } = Queries.useGetWalletActivity({});
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const balance = balanceData?.data?.walletBalance ?? 0;
  const activities = activityData?.data?.data || [];
  const stats = activityData?.data?.stats || { totalCredits: 0, totalDebits: 0 };
  const filtered = useMemo(
    () => (filter === "all" ? activities : activities.filter((a: any) => a.type === filter)),
    [activities, filter]
  );
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    filtered.forEach((i: any) => {
      const key = new Date(i.createdAt).toDateString();
      (map[key] ||= []).push(i);
    });
    return map;
  }, [filtered]);
  const copy = (t: string) => navigator.clipboard.writeText(t);
  if (isLoading) return <CommonLoader fullPage tip="Loading wallet..." />;
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.WALLET.BALANCE} breadcrumbs={BREADCRUMBS.WALLET.BALANCE} />
      <Wallet balance={balance} stats={stats} grouped={grouped} filter={filter} setFilter={setFilter} copy={copy} />
    </>
  );
};

export default WalletBalance;