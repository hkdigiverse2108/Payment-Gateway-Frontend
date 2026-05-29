import { useAppSelector } from "../../Store";
import AdminDashboard from "./Admin";
import UserDashboard from "./User";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  return user?.role === "admin"
    ? <AdminDashboard />
    : <UserDashboard />;
};

export default Dashboard;