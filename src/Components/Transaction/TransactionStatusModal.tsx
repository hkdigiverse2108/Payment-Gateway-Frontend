  import { useEffect, useState } from "react";
import CommonModal from "../Common/Modal/CommonModal";
import { Queries } from "../../Api";
import { Skeleton, Typography, Divider, Space, Alert } from "antd";
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
  const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(orderId);

  // Sync orderId from URL or props
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(window.location.search);
      // Support both `orderId` (new) and `order_id` (legacy) query keys
      const urlOrderId = params.get("orderId") || params.get("order_id");
      const urlStatus = params.get("status");

      console.log("CCAvenue redirect:", { urlOrderId, urlStatus });

      setResolvedOrderId(urlOrderId || orderId);
    }
  }, [isOpen, orderId]);

  const urlParams = new URLSearchParams(window.location.search);
  const customApiKey = urlParams.get('apiKey');
  const customSecretKey = urlParams.get('secretKey');
  const customKeys = customApiKey && customSecretKey ? { apiKey: customApiKey, secretKey: customSecretKey } : undefined;

  const storedSession = (() => {
    try {
      const raw = localStorage.getItem('paymentSession');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();
  // If URL does not provide orderId, use the stored orderId or traId.
  // If URL does not provide orderId, use the stored orderId or traId.
  const effectiveOrderId = resolvedOrderId || storedSession?.orderId || storedSession?.traId || null;
  const statusParams = effectiveOrderId ? { orderId: effectiveOrderId } : undefined;
  console.log('🔎 TransactionStatusModal - statusParams', statusParams);

  const { data, isFetching, isError } = Queries.useTransactionStatus(
    statusParams,
    customKeys,
    {
      refetchInterval: isOpen ? 2500 : false,
      refetchOnWindowFocus: true,
      enabled: !!effectiveOrderId,
      // Show more detailed error info if the backend returns 404.
      onError: (err) => {
        console.error('Transaction status fetch error:', err);
      },
    }
  );

  const responseData = data as any;
  const d = responseData?.data?.data || responseData?.data;
  let normalizeStatus = ((d?.status || d?.paymentStatus || d?.paymentIntentStatus || d?.payment_intent_status || "").toUpperCase());
  // Stripe returns "succeeded" – map it to the UI's SUCCESS label
  if (normalizeStatus === "SUCCEEDED") {
    normalizeStatus = "SUCCESS";
  }

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="Transaction">
      {isFetching && !d ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : isError ? (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Alert
            message="Error"
            description="Could not verify transaction status."
            type="error"
            showIcon
          />
        </Space>
      ) : d ? (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div className="flex justify-between items-center">
            <div>
              <Text type="secondary">Amount</Text>
              <div className="text-lg font-semibold">₹{d.amount || "-"}</div>
            </div>

            <Text
              style={{
                color:
                  normalizeStatus === "SUCCESS"
                    ? "#16a34a"
                    : normalizeStatus === "PENDING"
                    ? "#d97706"
                    : "#dc2626",
              }}
              className="font-bold"
            >
              {normalizeStatus || "PENDING"}
              {normalizeStatus === "PENDING" && (
                <span className="text-xs text-gray-400 animate-pulse">
                  {" "}
                  (Verifying...)
                </span>
              )}
            </Text>
          </div>

          <Divider style={{ margin: 0 }} />

          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Row
              label="Order ID"
              value={
                d.orderId ? (
                  <Text copyable={{ icon: [<MdContentCopy />, <CheckOutlined />] }}>
                    {d.orderId}
                  </Text>
                ) : "-"
              }
            />
            <Row
              label="Transaction ID"
              value={
                d.traId ? (
                  <Text copyable={{ icon: [<MdContentCopy />, <CheckOutlined />] }}>
                    {d.traId}
                  </Text>
                ) : "-"
              }
            />
            <Row label="Payment" value={d.paymentStatus || d.status || "-"} />
            <Row label="UTR" value={d.utr || "-"} />
          </Space>
        </Space>
      ) : (
        <Text type="secondary">No transaction data found.</Text>
      )}
    </CommonModal>
  );
};

export default TransactionStatusModal;

// import { useEffect, useState } from "react";
// import CommonModal from "../Common/Modal/CommonModal";
// import { Queries } from "../../Api";
// import { Skeleton, Typography, Divider, Space, Alert } from "antd"; 
// import { CheckOutlined } from "@ant-design/icons";
// import { MdContentCopy } from "react-icons/md";

// const { Text } = Typography;

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   orderId: string | null;
// };

// const Row = ({ label, value }: any) => (
//   <div className="flex justify-between">
//     <Text type="secondary">{label}</Text>
//     <Text className="font-medium text-gray-800">{value || "-"}</Text>
//   </div>
// );

// const TransactionStatusModal = ({ isOpen, onClose, orderId }: Props) => {
//   const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(orderId);

//   // 1. Sync incoming props or URL parameters
//   useEffect(() => {
//     if (isOpen) {
//       const urlParams = new URLSearchParams(window.location.search);
//       const urlOrderId = urlParams.get("order_id");
//       if (urlOrderId) {
//         setResolvedOrderId(urlOrderId);
//       } else {
//         setResolvedOrderId(orderId);
//       }
//     }
//   }, [isOpen, orderId]);

//   // 2. Fetch data from backend status route
//   const { data, isFetching, isError, refetch } = Queries.useTransactionStatus(
//     resolvedOrderId ? { orderId: resolvedOrderId } : undefined,
//     {
//       refetchInterval: isOpen ? 2500 : false,
//       refetchOnWindowFocus: true,
//     }
//   );

//   const responseData = data as any;
//   const d = responseData?.data?.data || responseData?.data;
//   const normalizeStatus = (d?.status || "").toUpperCase();

//   // Keep polling while the payment gateway webhook/verification updates the backend.
//   useEffect(() => {
//     if (isOpen && normalizeStatus === "PENDING") {
//       refetch();
//     }
//   }, [isOpen, normalizeStatus, refetch]);

//   return (
//     <CommonModal isOpen={isOpen} onClose={onClose} title="Transaction">
//       {isFetching && !d ? (
//         <Skeleton active paragraph={{ rows: 4 }} />
//       ) : isError ? (
//         <Space direction="vertical" size={16} style={{ width: "100%" }}>
//           <Alert
//             message="Error"
//             description="Could not verify transaction status."
//             type="error"
//             showIcon
//           />
//         </Space>
//       ) : d ? (
//         <Space direction="vertical" size={16} style={{ width: "100%" }}>
//           <div className="flex justify-between items-center">
//             <div>
//               <Text type="secondary">Amount</Text>
//               <div className="text-lg font-semibold">₹{d.amount || "-"}</div>
//             </div>

//             <Text
//               style={{
//                 color:
//                   normalizeStatus === "SUCCESS" ? "#16a34a" :
//                   normalizeStatus === "PENDING" ? "#d97706" : "#dc2626",
//               }}
//               className="font-bold"
//             >
//               {normalizeStatus || "PENDING"}
//               {normalizeStatus === "PENDING" && (
//                 <span className="text-xs font-normal text-gray-400 animate-pulse"> (Verifying...)</span>
//               )}
//             </Text>
//           </div>

//           <Divider style={{ margin: 0 }} />

//           <Space direction="vertical" size={8} style={{ width: "100%" }}>
//             <Row label="Order ID" value={d.orderId ? <Text italic copyable={{ text: d.orderId, icon: [<MdContentCopy />, <CheckOutlined />]}} style={{fontSize: "12px"}}>{d.orderId}</Text> : "-"} />
//             <Row label="Transaction ID" value={d.traId ? <Text italic copyable={{ text: d.traId, icon: [<MdContentCopy />, <CheckOutlined />]}} style={{fontSize: "12px"}}>{d.traId}</Text> : "-"} />
//             <Row label="Payment" value={d.paymentStatus || d.status || "-"} />
//             <Row label="UTR" value={d.utr ? <Text italic copyable={{ text: d.utr, icon: [<MdContentCopy />, <CheckOutlined />]}} style={{fontSize: "12px"}}>{d.utr}</Text> : "-"} />
//           </Space>

//         </Space>
//       ) : (
//         <Text type="secondary">No transaction data found.</Text>
//       )}
//     </CommonModal>
//   );
// };

// export default TransactionStatusModal;
