
const ProgressForm = () => {
    return (
        <div className="p-4">
            <div className="bg-white shadow-lg rounded-lg">
                <div className="flex items-center bg-gray-200 p-4 rounded-t-lg">
                    <span className="text-gray-600 mr-2">
                        <i className="fas fa-signal"></i>
                    </span>
                    <h5 className="text-lg font-semibold">Progress</h5>
                </div>
                <div className="p-4">
                    <form action="userprogress-req.php" method="POST">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-2"></div>
                            <div className="col-span-8">
                                <table className="min-w-full table-auto border border-gray-300">
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 p-2">Member's Fullname:</td>
                                            <td className="border border-gray-300 p-2"><strong>Harry Denn</strong></td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2">Service Taken:</td>
                                            <td className="border border-gray-300 p-2"><strong>Fitness</strong></td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2">Initial Weight: (KG)</td>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    id="weight"
                                                    type="number"
                                                    name="ini_weight"
                                                    defaultValue="54"
                                                    className="border rounded p-1"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2">Current Weight: (KG)</td>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    id="weight"
                                                    type="number"
                                                    name="curr_weight"
                                                    defaultValue="62"
                                                    className="border rounded p-1"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2">Initial Body Type:</td>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    id="ini_bodytype"
                                                    type="text"
                                                    name="ini_bodytype"
                                                    defaultValue="Slim"
                                                    className="border rounded p-1"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-2">Current Body Type:</td>
                                            <td className="border border-gray-300 p-2">
                                                <input
                                                    id="curr_bodytype"
                                                    type="text"
                                                    name="curr_bodytype"
                                                    defaultValue="Buffed"
                                                    className="border rounded p-1"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4 mt-4">
                            <div className="col-span-12 text-center">
                                {/* user's ID is hidden here */}
                                <input type="hidden" name="id" value="6" />
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProgressForm;
