import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "fullName",
  "Username",
  "Gender",
  "Contact Number",
  "D.O.R",
  "Address",
  "Amount",
  "Chosen Service",
  "Plan",
  "",
];

export function RegisteredMembers() {
  const [users, setUsers] = useState([]); // State for user data
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  // Function to handle the search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${FRONTEND_URL}/api/member/users`
        );
        setUsers(response.data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter rows based on search term
  const filteredRows = users.filter((user) => {
    return (
      (user.fullName &&
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.gender &&
        user.gender.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.contactNumber && user.contactNumber.includes(searchTerm)) ||
      (user.dateOfRegistration &&
        user.dateOfRegistration.includes(searchTerm)) ||
      (user.address &&
        `${user.address.street || ""}, ${user.address.city || ""}, ${
          user.address.state || ""
        } ${user.address.zipCode || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (user.amount && user.amount.toString().includes(searchTerm)) ||
      (user.chosenService &&
        user.chosenService.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.plan && user.plan.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Card className=" p-6">
      <CardHeader floated={false} shadow={false} className="rounded-none">
      <div className="text-right mb-4 space-x-2">
        <Link to="/admin/member/MemberEntryForm"
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Add Member
        </Link>
        <Link to="/admin/member/MemberManagement"
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Manage Member
        </Link>
      </div>
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Recent Registrations
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Details about the most recent registrations
            </Typography>
          </div>
          <div className="flex items-center w-full shrink-0 gap-2 md:w-auto">
            <div className="w-full md:w-72">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button
              className="flex items-center text-stone-700 gap-3"
              size="sm"
            >
              Search
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-0">
        {loading ? (
          <Typography variant="small" color="blue-gray" className="text-center">
            Loading...
          </Typography>
        ) : error ? (
          <Typography variant="small" color="red" className="text-center">
            {error}
          </Typography>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length > 0 ? (
                  filteredRows.map(
                    (
                      {
                        fullName,
                        username,
                        gender,
                        contactNumber,
                        dateOfRegistration,
                        address,
                        amount,
                        chosenService,
                        plan,
                      },
                      index
                    ) => {
                      const isLast = index === filteredRows.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={username}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {fullName}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {username}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {gender}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {contactNumber}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {dateOfRegistration}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {`${address.street}, ${address.city}, ${address.state} ${address.zipCode}`}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {amount}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {chosenService}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {plan}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Tooltip content="Edit User">
                              <IconButton variant="text">
                                <i className="fas fa-edit"></i>
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                      <Typography variant="small" color="blue-gray">
                        No results found
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
