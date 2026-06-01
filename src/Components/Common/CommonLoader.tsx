import React from "react";
import { Spin } from "antd";
import type { CommonLoaderProps } from "../../Types";

const CommonLoader: React.FC<CommonLoaderProps> = ({ fullPage = false, size = "default", tip, className, }) => {
  if (fullPage) {
    return (
      <div className="c-common-loader">
        <Spin size={size} tip={tip} />
      </div>
    );
  }
  return <Spin size={size} tip={tip} className={className} />;
};

export default CommonLoader;