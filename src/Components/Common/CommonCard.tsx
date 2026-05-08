import { Card, Typography, Divider, Button } from "antd";
import { Link } from "react-router-dom";
import { type FC } from "react";
import type { CommonCardProps } from "../../Types";

const { Title } = Typography;

const CommonCard: FC<CommonCardProps> = ({ title, children, hideDivider = false, topContent, btnHref, className }) => {
  return (
    <Card
      className={`common-card ${className}`}
      bodyStyle={{ padding: 0 }}
    >
      {(title || topContent || btnHref) && (
        <div className="common-card-header m-5 ">
          {title && (
            <Title
              level={5}
              className="common-card-title"
            >
              {title}
            </Title>
          )}
          {topContent}
          {btnHref && (
            <Link to={btnHref}>
              <Button type="primary" size="small">
                ADD
              </Button>
            </Link>
          )}
        </div>
      )}
      {!hideDivider && <Divider style={{ margin: 0 }} />}
      <div>{children}</div>
    </Card>
  );
};

export default CommonCard;