export default function AboutModal({ closeModal }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">About TerpBites</h2>
        <p className="text-gray-700">
          TerpBites scrapes data from the UMD Dining Hall website using the
          BeautifulSoup library. The data is stored in an AWS RDS database. When
          a user searches, the data is retrieved from the database and displayed
          in the frontend. The backend API is written in Flask and the scraping
          logic in Python, both deployed on AWS Lambda.
        </p>
      </div>
    </div>
  );
}
