import { Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { Queries } from "../../../Api";

const ExportToPDF = ({ params }: { params: Record<string, any> }) => {
  const handleExport = async () => {
    const res = await Queries.exportTransaction({
      ...params,
      type: "pdf",
    });
      
    // 👇 safety check
    if (!res || !(res instanceof Blob)) {
      console.error("Invalid file response");
      return;
    }
    const url = window.URL.createObjectURL(res);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.pdf";
    a.click();
  };
  return (
    <Button icon={<FilePdfOutlined />} onClick={handleExport}>
      Export PDF
    </Button>
  );
};

export default ExportToPDF;