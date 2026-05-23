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
      bordered={false}
      style={{ background: 'transparent' }}
    >
      <Panel
        header={<span className="text-sm font-bold text-foreground">Advanced Search</span>}
        key="1"
        className="advanced-search-panel" 
        style={{ border: 'none' }}
      >
        <div className="advanced-search-body" style={{ width: '100%' }}>
          {/* Reduced vertical gutter from 24 to 12 to eliminate the bottom empty gap */}
          <Row gutter={[16, 12]} align="top" style={{ width: '100%', margin: 0 }}>
            {filter.map((item, i) => (
              <Col 
                key={i} 
                {...(item.grid || { xs: 24, sm: 12, md: 8 })}
                style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 0 }}
              >
                {/* 1. Label Section displayed strictly above */}
                {item.label && (
                  <span 
                    className="text-xs font-semibold uppercase tracking-wider text-muted"
                    style={{ 
                      display: 'block', 
                      marginBottom: '2px',
                      lineHeight: '1.2'
                    }}
                  >
                    {item.label}
                  </span>
                )}
                
                {/* 2. Dropdown Container Block */}
                <div style={{ position: 'relative', width: '100%', display: 'block' }}>
                  <CommonSelect
                    label="" 
                    options={item.options}
                    value={item.value}
                    onChange={(val) => item.onChange?.(val)} 
                    multiple={item.multiple}
                    limitTags={item.limitTags ?? 1}
                    isLoading={item.isLoading}
                  />
                </div>
              </Col>
            ))}
            
            {children && (
              <Col span={24} style={{ marginTop: '4px' }}>
                {children}
              </Col>
            )}
          </Row>
        </div>
      </Panel>
    </Collapse>
  );
};

export default AdvancedSearch;