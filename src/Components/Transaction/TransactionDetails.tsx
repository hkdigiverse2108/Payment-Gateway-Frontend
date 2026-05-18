import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PhoneOutlined, MailOutlined, PrinterOutlined, DownloadOutlined, DropboxOutlined, ShareAltOutlined, ReloadOutlined } from "@ant-design/icons";
import { Card, Button, Typography, Tag, Space, Divider, Row, Col } from "antd";
import { Queries } from "../../Api";
import CommonLoader from "../Common/CommonLoader";
import CommonBreadcrumbs from "../Common/CommonBreadcrumbs";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { statusColorMap } from "../../Types";

const { Text, Title } = Typography;

const TransactionDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = Queries.useGetTransaction();
  const transaction = useMemo(() => {
    return data?.data?.data?.find((tran: any) => String(tran._id) === String(id));
  }, [data, id]);
  if (isLoading) return <CommonLoader fullPage tip="Loading..." />;
  if (error || !transaction) return <CommonLoader fullPage tip="Not found" />;
  const isDeposit = transaction.type?.toLowerCase() === "deposit";
  const handleExport = () => {
  const row = {
    id: transaction._id,
    orderId: transaction.orderId,
    amount: transaction.amount,
    type: transaction.type,
    status: transaction.status,
  };

  const csv = Object.entries(row)
      .map(([k, v]) => `${k},${v}`)
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transaction-${id}.csv`;
    a.click();
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.DETAILS} maxItems={1} breadcrumbs={BREADCRUMBS.TRANSACTIONS.DETAILS} />
      <div className="tx-page">
        <Row className="tx-header">
          <Col className="tx-heading">
            <Title level={4} className="tx-title"> Transaction History </Title>
            <Text className="tx-subtitle">
              Transactions / #{transaction.orderId || transaction.traId}
            </Text>
          </Col>
          <Space className="tx-header-actions">
            {/* <Button shape="circle" icon={<PrinterOutlined />} onClick={() => window.print()} />
            <Button shape="circle" icon={<DownloadOutlined />} onClick={() => alert("download")} /> */}
            <Button shape="circle" icon={<ShareAltOutlined />} onClick={handleShare} />
            <Button shape="circle" icon={<DropboxOutlined />} onClick={handleExport} /> 
            <Button shape="circle" icon={<ReloadOutlined />} onClick={() => window.location.reload()} />
          </Space>
        </Row>
        <div className="print-area">
          <Card className="tx-card">
            <Row gutter={[24, 24]} align="middle" className="tx-primary-row">
              <Col xs={24} lg={10} className="tx-id-col">
                <Text className="tx-id-label">ID Payment</Text>
                <Title level={2} className="tx-id"> #{transaction.orderId || transaction.traId} </Title>
                <Space wrap className="tx-tags">
                  <Tag className="tx-tag" color={isDeposit ? "green" : "red"}> {transaction.type} </Tag>
                  <Tag className="tx-tag" color={statusColorMap[transaction.status] || "default"}>{transaction.status} </Tag>
                </Space>
              </Col>
              <Col xs={24} sm={12} lg={8} className="tx-contact-col text-center">
                <Space direction="vertical" size={12} className="tx-contact-stack">
                  <div className="tx-contact-item">
                    <PhoneOutlined />
                    <Text>{transaction?.metadata?.customerPhone || "-"}</Text>
                  </div>
                  <div className="tx-contact-item">
                    <MailOutlined />
                    <Text>{transaction?.metadata?.customerEmail || "-"}</Text>
                  </div>
                  <Space wrap className="tx-action-buttons">
                    <Button icon={<PrinterOutlined />} onClick={() => window.print()} > Print </Button>
                    <Button type="primary" icon={<DownloadOutlined />} > Download </Button>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="tx-amount-box">
                  <Text className="tx-amount-label">Amount</Text>
                  <div className={`tx-amount-value ${ isDeposit ? "text-success" : "text-warning" }`} >
                    ₹ {transaction.amount}
                  </div>
                </div>
              </Col>
            </Row>
            <Divider className="tx-divider" />
            <Row gutter={[24, 20]} className="tx-detail-row">
              <Col xs={24} lg={6} className="tx-customer-col">
                <Title level={5} className="tx-customer-name"> {transaction?.metadata?.customerName || "Unknown"} </Title>
                <Text className="tx-subtitle"> {transaction?.metadata?.customerEmail} </Text>
              </Col>
              <Col xs={24} lg={18}>
                <Row gutter={[16, 16]}>
                  {[
                    // ["Payment Method", transaction.gateway],
                    ["Order ID", transaction.orderId],
                    ["Transaction ID", transaction.traId],
                    ["Status", transaction.status],
                    ["Type", transaction.type],
                    ["Amount", `₹ ${transaction.amount}`],
                  ].map(([label, value]) => (
                    <Col xs={24} sm={12} xl={8} key={label}>
                      <Text className="tx-label">{label}</Text>
                      <div className="tx-detail-value">{value || "-"}</div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
