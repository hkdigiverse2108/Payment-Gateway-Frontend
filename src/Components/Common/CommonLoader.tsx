import React from "react";
import { Spin } from "antd";
import type { CommonLoaderProps } from "../../Types";

const CommonLoader: React.FC<CommonLoaderProps> = ({ fullPage = false, size = "medium", description, tip, className, }) => {
  const spinTitle = description ?? tip;
  if (fullPage) {
    return (
      <div className="c-common-loader">
        <Spin size={size} description={spinTitle} />
      </div>
    );
  }
  return <Spin size={size} description={spinTitle} className={className} />;
};

export default CommonLoader;