import { Breadcrumb } from "antd";
import type { FC } from "react";
import type { BreadcrumbHeaderProps, BreadcrumbItem } from "../../Types";
import { ROUTES } from "../../Constants";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const CommonBreadcrumbs: FC<BreadcrumbHeaderProps> = ({ title, breadcrumbs = [] }) => {
  const finalBreadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: ROUTES.HOME },
    ...breadcrumbs,
  ];
  const items = finalBreadcrumbs.map((item, index) => {
    const isLast = index === finalBreadcrumbs.length - 1;
    return {
      title: item.href ? (
        <Link to={item.href} className={`cb-link ${isLast ? "active" : ""}`} >
          {item.label}
        </Link>
      ) : (
        <span className="cb-current">{item.label}</span>
      ),
    };
  });
  return (
    <div className="cb-wrapper">
      <div className="cb-left">
        <HomeOutlined className="cb-home-icon" />
        <h2 className="cb-title">{title}</h2>
      </div>
      <div className="cb-right">
        <Breadcrumb items={items} />
      </div>
    </div>
  );
};

export default CommonBreadcrumbs;