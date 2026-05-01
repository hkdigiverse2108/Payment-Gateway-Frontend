import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Store";
import { setSignOut } from "../../Store";
import { ROUTES } from "../../Constants";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setSignOut());
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">User Dashboard</h1>

      <Button
        type="primary"
        danger
        onClick={handleLogout}
        className="h-10 px-6 rounded-lg"
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;