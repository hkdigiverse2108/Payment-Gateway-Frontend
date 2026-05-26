import { Row, Col, Card, Tag } from "antd";
import { GATEWAYS } from "../../../Data";

const Gateway = ({ selected, onSelect }: any) => {
  return (
    <div>
      <h2 className="gateway-title">Select Gateway</h2>
      <p className="gateway-subtitle">Choose payment method to continue</p>
      <Row gutter={[16, 16]}>
        {GATEWAYS.map((g) => {
          const isActive = selected === g.key;
          return (
            <Col xs={24} sm={12} lg={8} key={g.key}>
              <Card
                hoverable
                onClick={() => onSelect(g.key)}
                className={`cursor-pointer transition border-none! ${
                  isActive ? "border-primary shadow-md" : ""
                }`}
                bodyStyle={{ padding: 16 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <img src={g.logo} alt={g.name} className="h-6 mr-2" />
                    {/* <span>{g.name}</span> */}
                  </div>

                  {g.badge && <Tag color="green">{g.badge}</Tag>}
                </div>

                <p className="text-xs text-gray-500">{g.desc}</p>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Gateway;