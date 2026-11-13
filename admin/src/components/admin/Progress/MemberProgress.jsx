
const MembersProgressTable = () => {
    const members = [
        { id: 6, fullname: 'Harry Denn', service: 'Fitness', plan: '1 Month/s' },
        { id: 8, fullname: 'Charles Anderson', service: 'Fitness', plan: '3 Month/s' },
        { id: 11, fullname: 'Justin Schexnayder', service: 'Cardio', plan: '3 Month/s' },
        { id: 14, fullname: 'Ryan Crowl', service: 'Fitness', plan: '12 Month/s' },
        { id: 16, fullname: 'TrialsChanged', service: 'Fitness', plan: '0 Month/s' },
        { id: 17, fullname: 'Karen McGray', service: 'Cardio', plan: '3 Month/s' },
        { id: 18, fullname: 'Jeanne Pratt', service: 'Fitness', plan: '1 Month/s' },
        { id: 19, fullname: 'George Fann', service: 'Fitness', plan: '1 Month/s' },
        { id: 20, fullname: 'Wendy Scott', service: 'Fitness', plan: '1 Month/s' },
        { id: 21, fullname: 'Patrick Wilson', service: 'Cardio', plan: '3 Month/s' },
        { id: 22, fullname: 'Tommy Marks', service: 'Fitness', plan: '3 Month/s' },
        { id: 23, fullname: 'Keith Martin', service: 'Cardio', plan: '3 Month/s' },
        { id: 24, fullname: 'Richard G Langston', service: 'Sauna', plan: '12 Month/s' },
        { id: 25, fullname: 'Raymond Ledesma', service: 'Cardio', plan: '12 Month/s' },
        { id: 26, fullname: 'Mattie F. Maher', service: 'Sauna', plan: '12 Month/s' },
        { id: 27, fullname: 'Justin C. Lusk', service: 'Cardio', plan: '1 Month/s' },
        { id: 29, fullname: 'Kathy J. Glennon', service: 'Fitness', plan: '6 Month/s' },
    ];

    return (
        <div className="p-4">
            <div className="bg-white shadow-lg rounded-lg">
                <div className="flex items-center justify-between bg-gray-200 p-4 rounded-t-lg">
                    <span className="text-gray-600 mr-2">
                        <i className="fas fa-th"></i>
                    </span>
                    <h5 className="text-lg font-semibold">Member's Table</h5>
                    <form id="custom-search-form" role="search" method="POST" action="search-result-progress.php" className="flex items-center">
                        <input
                            type="text"
                            className="border rounded-l-md p-2"
                            placeholder="Search"
                            name="search"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white rounded-r-md p-2">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 mt-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">#</th>
                                <th className="border border-gray-300 p-2">Fullname</th>
                                <th className="border border-gray-300 p-2">Chosen Service</th>
                                <th className="border border-gray-300 p-2">Plan</th>
                                <th className="border border-gray-300 p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => (
                                <tr key={member.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 p-2 text-center">{member.fullname}</td>
                                    <td className="border border-gray-300 p-2 text-center">{member.service}</td>
                                    <td className="border border-gray-300 p-2 text-center">{member.plan}</td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <a href={`update-progress.php?id=${member.id}`}>
                                            <button className="bg-yellow-500 text-white rounded-md p-1">Update Progress</button>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MembersProgressTable;
