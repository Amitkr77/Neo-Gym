import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import DashBoard from "./DashBorad";
import Equipment from "./Equipment";
import Member from "./Member";
import Payment from "./Payment";
import MemberProgress from "./MemberProgress";
import Annoucement from "./Annoucement";
import StaffManagement from "./StaffManagement";
import Reports from "./Reports";
import { CiLogout } from "react-icons/ci";
import MakeAnnouncement from "./Announcement/MakeAnnouncement";
import ManageAnnouncement from "./Announcement/ManageAnnouncement";
import StaffList from "./Staff/SatffList";
import StaffAdd from "./Staff/SatffAdd";
import PaymentForm from "./Payment/PaymentForm";
import PaymentReceipt from "./Payment/PaymentReceipt";
import MemberPaymentTable from "./Payment/MemberPaymentTable";
import { RegisteredMembers } from "./Memebers/RegisteredMembers";
import MemberEntryForm from "./Memebers/MemberEntryForm";
import { MemberManagement } from "./Memebers/MemberManagement";
import { EquipmentManagement } from "./Equipment/EquipmentManagement";
import { EquipmentInfoForm } from "./Equipment/EquipmentInfoForm";
import { EquipmentList } from "./Equipment/EquipmentList";
import { RxDashboard } from "react-icons/rx";
import { LuDumbbell } from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import { TbUsersGroup, TbUserSquareRounded } from "react-icons/tb";
import { TfiAnnouncement } from "react-icons/tfi";
import { RiUserStarLine } from "react-icons/ri";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { GiProgression } from "react-icons/gi";

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    confirm('are you sure')

    // Redirect user to the login page or home page
    navigate("/");
  };

  return (
    <div className="h-screen flex bg-gray-100 p-6">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-gray-800 text-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/admin/dashboard"
                className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                <RxDashboard className="mr-2" />
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/equipment/EquipmentList"
                className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                <LuDumbbell className="mr-2" />
                Equipment
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/payment/MemberPaymentTable"
                className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                <MdCurrencyRupee className="mr-2" />
                Payment
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/member/RegisteredMembers"
                className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                <TbUsersGroup className="mr-2" />
                Member
              </Link>
            </li>
            {/* <li className="mb-2">
              <Link
                to="/admin/memberProgress"
                className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                <GiProgression className="mr-2" />
                Member Progress
              </Link>
            </li> */}
            <li className="mb-2">
              <Link
                to="/admin/annoucement/MakeAnnouncement"
                className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                <TfiAnnouncement className="mr-2" />
                Announcement
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/staffManagement/StaffList"
                className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                <RiUserStarLine className="mr-2" />
                Staff Management
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/admin/reports"
                className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              >
                <BsFileEarmarkBarGraph className="mr-2" />
                Reports
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full flex flex-col overflow-y-auto  bg-gray-100 shadow-inner space-y-2">
        <div className=" ml-1 border-0 space-x-1 flex ">
          <button  className="rounded-sm px-2 py-2 bg-slate-800 hover:bg-slate-900 border-0 text-white flex items-center gap-1">
            <TbUserSquareRounded /> Welcome Admin
          </button>
          <button onClick={handleLogout} className="bg-red-500 rounded-sm hover:bg-red-600 border-0 px-2 py-2 text-white  flex items-center gap-1">
            Logout <CiLogout className="ml-2" />
          </button>
        </div>

        {/* Define routes */}
        <Routes>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/equipment" element={<Equipment />}>
            <Route index element={<EquipmentList />} /> {/* Default route for equipment */}
            <Route path="EquipmentManagement" element={<EquipmentManagement />} />
            <Route path="EquipmentInfoForm" element={<EquipmentInfoForm />} />
            <Route path="EquipmentList" element={<EquipmentList />} />
          </Route>
          <Route path="/payment" element={<Payment />}>
            <Route path="MemberPaymentTable" element={<MemberPaymentTable />} />
            <Route path="PaymentForm" element={<PaymentForm />} />
            <Route path="PaymentReceipt" element={<PaymentReceipt />} />
          </Route>
          <Route path="/member" element={<Member />}>
            <Route path="RegisteredMembers" element={<RegisteredMembers />} />
            <Route path="MemberEntryForm" element={<MemberEntryForm />} />
            <Route path="MemberManagement" element={<MemberManagement />} />
          </Route>
          <Route path="/memberProgress" element={<MemberProgress />} />
          <Route path="/annoucement" element={<Annoucement />}>
            <Route path="MakeAnnouncement" element={<MakeAnnouncement />} />
            <Route path="ManageAnnouncement" element={<ManageAnnouncement />} />
          </Route>
          <Route path="/staffManagement" element={<StaffManagement />}>
            <Route path="StaffList" element={<StaffList />} />
            <Route path="StaffAdd" element={<StaffAdd />} />
          </Route>
          <Route path="/reports" element={<Reports />} />

          {/* Default Route */}
          <Route path="/" element={<DashBoard />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
