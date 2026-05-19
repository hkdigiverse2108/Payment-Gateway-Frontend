import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const { Content } = Layout;

const AppLayout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  // const dispatch = useAppDispatch();
  // const {
  //   data: userData,
  //   isLoading: userLoading,
  // } = Queries.useGetUser();
  // useEffect(() => {
  //   if (userData?.data) {
  //     dispatch(setUser(userData.data));
  //   }
  // }, [dispatch, userData]);
  return (
    <>
      {/* <Loader loading={userLoading} /> */}
      <Layout className="layout-main">
        <Sidebar openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        <Layout className="layout-inner">
          <Header onOpenDrawer={() => setOpenDrawer(true)} />
          <Content className="layout-content">
            <div className="layout-contant-main">
              <div className="layout-contant-center">
                <div className="layout-contant-inner max-w-[1400px] mx-auto px-6 w-full">
                  <Outlet />
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>  
  );
};
export default AppLayout;