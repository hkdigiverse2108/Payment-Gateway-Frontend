import CommonModal from "../Common/Modal/CommonModal";
import { Queries } from "../../Api";
import { Skeleton, Typography, Divider, Space } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { MdContentCopy } from "react-icons/md";


const { Text } = Typography;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
};

const Row = ({ label, value }: any) => (
  <div className="flex justify-between">
    <Text type="secondary">{label}</Text>
    <Text className="font-medium text-gray-800">{value || "-"}</Text>
  </div>
);

const TransactionStatusModal = ({ isOpen, onClose, orderId }: Props) => {
  const { data, isFetching } = Queries.useTransactionStatus(
    orderId ? { orderId } : undefined
  );

  const d = data?.data;

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="Transaction">
      {isFetching ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : d ? (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div className="flex justify-between items-center">
            <div>
              <Text type="secondary">Amount</Text>
              <div className="text-lg font-semibold">₹{d.amount}</div>
            </div>

            <Text
              style={{
                color:
                  d.status === "success"
                    ? "#16a34a"
                    : d.status === "pending"
                    ? "#d97706"
                    : d.status === "failed"
                    ? "#dc2626"
                    : undefined,
              }}
            >
              {d.status}
            </Text>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* Details */}
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Row
              label="Order ID"
              value={
                <Text italic copyable={{ text: d.orderId, icon: [<MdContentCopy />, <CheckOutlined />]}} style={{fontSize: "12px"}}>
                  {d.orderId}
                </Text>
              }
            />

            <Row
              label="Transaction ID"
              value={
                <Text italic copyable={{ text: d.traId, icon: [<MdContentCopy />, <CheckOutlined />]}} style={{fontSize: "12px"}}>
                  {d.traId}
                </Text>
              }
            />

            <Row label="Payment" value={d.paymentStatus} />

            <Row
              label="UTR"
              value={
                d.utr ? (
                  <Text italic copyable={{ text: d.utr, icon: [<MdContentCopy />, <CheckOutlined />]}} style={{fontSize: "12px"}}>{d.utr}</Text>
                ) : (
                  "-"
                )
              }
            />
          </Space>

        </Space>
      ) : (
        <Text type="secondary">No data</Text>
      )}
    </CommonModal>
  );
};

export default TransactionStatusModal;