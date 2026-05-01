import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Store";
import { setSignOut } from "../../../Store";
import { ROUTES } from "../../../Constants";
import Layout from "../../../Layout";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setSignOut());
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <>
      <Layout />
      <div className="h-full flex flex-col items-center justify-center gap-6">
      
        <h1 className="text-2xl font-semibold">UserDashboard
          
        </h1>

        <Button
          type="primary"
          danger
          onClick={handleLogout}
          className="h-10 px-6 rounded-lg"
        >
          Logout
        </Button>

      </div>
    </>
  );
};

export default Dashboard;