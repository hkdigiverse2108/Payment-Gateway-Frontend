import { Row, Col } from "antd";
import {
  CashflowChart,
  InsightsPanel,
  LastTransactions,
  SpendingSummary,
  TopSummary,
  UserActivityGraphs,
} from "../../../Components/Dashboard/UserDashboardSections";
import { useUserDashboard } from "./useUserDashboard";

const UserDashboard = () => {
  const data = useUserDashboard();

  return (
    <div className="user-dashboard-page">
      <section className="c-section">
        <TopSummary data={data} />
      </section>
      <section className="c-section">
        <CashflowChart data={data.cashflowData} />
      </section>
      <section className="c-section">
        <UserActivityGraphs data={data} />
      </section>
      <section className="c-section">
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={12}>
            <LastTransactions transactions={data.transactions} />
          </Col>
          <Col xs={24} lg={12}>
            <SpendingSummary data={data} />
          </Col>
        </Row>
      </section>
      <section className="c-section">
        <InsightsPanel data={data} />
      </section>
    </div>
  );
};

export default UserDashboard;
