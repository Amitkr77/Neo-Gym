
export default function ProgressUpdatedMessage() {
  return (
    <div className="p-4">
    <div className="bg-white shadow-lg rounded-lg">
        <div className="flex items-center bg-gray-200 p-4 rounded-t-lg">
            <span className="text-gray-600 mr-2">
                <i className="fas fa-briefcase"></i>
            </span>
            <h5 className="text-lg font-semibold">Administrator</h5>
        </div>
        <div className="p-6 text-center">
            <div className="error_ex">
                <h1 className="text-4xl font-bold text-green-600">Successful</h1>
                <h3 className="text-2xl font-semibold">Changes Done Successfully!</h3>
                <p className="mt-4 text-gray-600">
                    The requested user's progress has been updated. Please click the button to go back.
                </p>
                <a 
                    className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200" 
                    href="index.php"
                >
                    Return Home
                </a>
            </div>
        </div>
    </div>
</div>
  )
}
