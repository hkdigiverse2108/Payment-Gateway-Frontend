import { Collapse, Row, Col } from "antd";
import type { FC } from "react";
import type { AdvancedSearchProps } from "../../Types";
import { CommonSelect } from "../../Attribute/FormFields/CommonSelect";

const { Panel } = Collapse;

const AdvancedSearch: FC<AdvancedSearchProps> = ({
  children,
  filter = [],
  defaultExpanded,
}) => {
  if (!filter.length && !children) return null;

  return (
    <Collapse
      defaultActiveKey={defaultExpanded ? ["1"] : []}
      className="advanced-search"
    >
      <Panel header="Advanced Search" key="1">
        <Row gutter={[12, 12]} align="middle">
          {filter.map((item, i) => (
            <Col key={i} {...(item.grid || { xs: 24, sm: 12, md: 8 })}>
              <CommonSelect
                label={item.label}
                options={item.options}
                value={item.value}
                onChange={item.onChange}
                multiple={item.multiple}
                limitTags={item.limitTags ?? 1}
                isLoading={item.isLoading}
              />
            </Col>
          ))}

          {children && <Col span={24}>{children}</Col>}
        </Row>
      </Panel>
    </Collapse>
  );
};

export default AdvancedSearch;