import { Card, Typography, Divider, Button } from "antd";
import { Link } from "react-router-dom";
import { type FC } from "react";
import type { CommonCardProps } from "../../Types";
import { CommonButton, CommonInput } from "../../Attribute";
import { Check, Edit3 } from "lucide-react";
import { motion } from "framer-motion";

const { Title } = Typography;

const CommonCard: FC<CommonCardProps> = ({ title, children, hideDivider = false, topContent, btnHref, className }) => {
  return (
    <Card
      className={`c-common-card ${className}`}
      styles={{ body: { padding: 0 } }}
    >
      {(title || topContent || btnHref) && (
        <div className="c-common-card-header">
          {title && (
            <Title
              level={5}
              className="c-common-card-title"
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

export const FieldCard = ({ field, value, isEditing, onToggle }: any) => {
  const Icon = field.icon;
  return (
    <div className="rounded-2xl border border-border/20 bg-tableback/20 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted" />
          <span className="text-xs font-bold uppercase text-muted">
            {field.label}
          </span>
        </div>
        <CommonButton variant="icon-only" className="icon-btn" onClick={onToggle} >
          {isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        </CommonButton>
      </div>
      {isEditing ? (
        <CommonInput name={field.name} type={field.type || "text"} />
      ) : (
        <p className="min-h-6 break-words text-sm font-semibold text-foreground">
          {field.prefix}
          {String(value || "-")}
        </p>
      )}
    </div>
  );
};

export const MotionCard = ({ children, className = "", hoverY = -2 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: hoverY }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className={className} >
        {children}
      </Card>
    </motion.div>
  );
};
