import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Queries } from "../../../Api";

const ExportToExcel = ({ params }: { params: Record<string, any> }) => {
  const handleExport = async () => {
      const res = await Queries.exportTransaction(params);
      
    // 👇 safety check
    if (!res || !(res instanceof Blob)) {
      console.error("Invalid file response");
      return;
    }
    const url = window.URL.createObjectURL(res);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <Button icon={<DownloadOutlined />} onClick={handleExport}>
      Export Excel
    </Button>
  );
};

export default ExportToExcel;