import { Breadcrumb } from "antd";
import type { FC } from "react";
import type { BreadcrumbHeaderProps, BreadcrumbItem } from "../../Types";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const CommonBreadcrumbs: FC<BreadcrumbHeaderProps> = ({ title, breadcrumbs = [] }) => {
  const finalBreadcrumbs: BreadcrumbItem[] = breadcrumbs.length > 0 ? breadcrumbs.slice(0, -1) : [];
  const items = [
    {
      title: ( <Link to="/" className="cb-home"> <HomeOutlined /> </Link> ),
    },
    ...finalBreadcrumbs.map((item) => ({
      title: item.href ? (
        <Link to={item.href} className="cb-link">
          {item.label}
        </Link>
      ) : (
        <span className="cb-current">{item.label}</span>
      ),
    })),
  ];
  return (
    <div className="cb-wrapper">
      <div className="cb-header">
        <div className="cb-left"> <h2 className="cb-title">{title}</h2> </div>
        <div className="cb-right">
          <Breadcrumb separator={<span className="cb-separator">/</span>} items={items} />
        </div>
      </div>
    </div>
  );
};

export default CommonBreadcrumbs;