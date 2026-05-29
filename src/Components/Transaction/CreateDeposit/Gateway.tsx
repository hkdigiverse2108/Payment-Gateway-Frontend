import { Row, Col, Card, Tag } from "antd";
import { GATEWAYS } from "../../../Data";

const Gateway = ({ selected, onSelect }: any) => {
  return (
    <div>
      <h2 className="gateway-title">Select Gateway</h2>
      <p className="gateway-subtitle">Choose payment method to continue</p>

      <Row gutter={[16, 16]}>
        {GATEWAYS.map((gateway) => {
          const isActive = selected === gateway.key;

          return (
            <Col xs={24} sm={12} lg={8} key={gateway.key}>
              <Card
                hoverable
                onClick={() => onSelect(gateway.key)}
                className={`bg-border/10!
                  cursor-pointer transition
                  gateway-card
                  ${isActive ? "gateway-card-active" : ""}
                `}
                styles={{
                  body: {
                    padding: 16,
                  },
                }}
              >
                <div className="flex justify-between items-center mb-2 bg-">
                  <div className="flex items-center gap-2">
  <div className="bg-foreground/10 p-2 rounded-md flex items-center justify-center">
    <img
      src={gateway.logo}
      alt={gateway.name}
      className="h-6 w-auto"
    />
  </div>
</div>

                  {gateway.badge && (
                    <Tag className="gateway-tag !m-0" >
                      {gateway.badge}
                    </Tag>
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  {gateway.desc}
                </p>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Gateway;