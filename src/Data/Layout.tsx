import { IoHome, IoSettingsSharp } from "react-icons/io5";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { MdPayment } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { BsFillWalletFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import type { JSX } from "react";
import type { SidebarIconKey } from "../Types";

export const sidebarIconMap: Record<SidebarIconKey, JSX.Element> = {
  dashboard: <IoHome />,
  orders: <AiOutlineUnorderedList />,
  payments: <MdPayment />,
  transactions: <GrTransaction />,
  wallet: <BsFillWalletFill />,
  users: <FaUser />,
  settings: <IoSettingsSharp />,
  
};