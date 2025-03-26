import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { PiUsersThree } from "react-icons/pi";
import { LiaUserClockSolid } from "react-icons/lia";
import { CgGym } from "react-icons/cg";
import { MdCurrencyRupee } from "react-icons/md";
import { SlUserFollowing } from "react-icons/sl";
import { RiTodoLine } from "react-icons/ri";
import axios from "axios";
import FRONTEND_URL from "../../../constant/const";

export default function ChartConfig() {
  const [staffData, setStaffData] = useState("");
  const [memberData, setMemberData] = useState("");
  const [equipmentData,setEquipmentData]=useState("")
  const chartConfig = {
    type: "bar",
    height: 250,
    width: 700,
    series: [
      {
        name: "people",
        data: [2, 10, 8],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        text: "Total",
        align: "center",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          color: "#000",
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 600,
          },
        },
        categories: ["Cardio", "Fitness", "Sauna"],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${FRONTEND_URL}/api/staff`);
        setStaffData(res.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMember = async () => {
      try {
        const res = await axios.get(`${FRONTEND_URL}/api/member/users`);
        setMemberData(res.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchEquipment = async() =>{
      try {
        const res =  await axios.get(`${FRONTEND_URL}/api/equipment`);
        setEquipmentData(res.data.data.length)
      } catch (error) {
        console.log(error);
      }
    }

    fetchEquipment();
    fetchMember();
    fetchStaff();
  }, []);
  return (
    <>
      <section className="border p-2">
        <div className="flex items-center gap-1 border py-1 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <h1 className="border-l p-1">Service Reports</h1>
        </div>
        <div className="flex p-6">
          <div>
            <Card>
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
              ></CardHeader>
              <CardBody className="px-2 pb-0">
                <Chart {...chartConfig} />
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-2 w-[700px] gap-2 max-[500px]:grid-cols-1 px-3">
            <div className="group w-full rounded-lg bg-[#673ab7] p-5 transition flex items-center justify-between duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_#2196f3]">
              <div>
                <p className="text-white text-2xl">{memberData}</p>
                <p className="text-white text-sm">Total Mmebers</p>
              </div>
              <div className="group-hover:text-white  group-hover:opacity-100 opacity-20 transition group-hover:scale-110 duration-300">
                <PiUsersThree className="h-10 w-10" />
              </div>
            </div>
            <div className="group w-full rounded-lg bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] flex items-center justify-between">
              <div>
                <p className="text-white text-2xl">{staffData}</p>
                <p className="text-white text-sm">Staff</p>
              </div>
              <div className="group-hover:text-white text-gray-300 group-hover:opacity-100 opacity-20 transition group-hover:scale-110 duration-300">
                <LiaUserClockSolid className=" h-10 w-10" />
              </div>
            </div>
            <div className="group w-full rounded-lg bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] flex items-center justify-between">
              <div>
                <p className="text-white text-2xl">{equipmentData}</p>
                <p className="text-white text-sm">Total Equipments</p>
              </div>
              <div className="group-hover:text-white text-gray-300 group-hover:opacity-100 opacity-20 transition group-hover:scale-110 duration-300">
                <CgGym className=" h-10 w-10" />
              </div>
            </div>
            <div className="group w-full rounded-lg bg-[#673ab7] p-5 transition flex items-center justify-between duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_#2196f3]">
              <div>
                <p className="text-white text-2xl flex items-center">
                  <MdCurrencyRupee />
                  17
                </p>
                <p className="text-white text-sm">Total Earnings</p>
              </div>
              <div className="group-hover:text-white group-hover:opacity-100 opacity-20 transition group-hover:scale-110 duration-300">
                <MdCurrencyRupee className="h-10 w-10" />
              </div>
            </div>
            <div className="group w-full rounded-lg bg-[#673ab7] p-5 transition flex items-center justify-between duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_#2196f3]">
              <div>
                <p className="text-white text-2xl">4</p>
                <p className="text-white text-sm"> Active Gym Trainers</p>
              </div>
              <div className="group-hover:text-white group-hover:opacity-100 opacity-20 transition group-hover:scale-110 duration-300">
                <SlUserFollowing className="h-10 w-10" />
              </div>
            </div>
            {/* <div className="group w-full rounded-lg bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)] flex items-center justify-between">
              <div>
                <p className="text-white text-2xl">14</p>
                <p className="text-white text-sm">Present Members</p>
              </div>
              <div className="group-hover:text-white text-gray-300 group-hover:opacity-100 opacity-20 transition group-hover:scale-110 duration-300">
                <RiTodoLine className=" h-10 w-10" />
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}
