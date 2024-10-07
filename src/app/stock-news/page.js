'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const topicsList = [
  'Technology',
  'Finance',
  'Healthcare',
  'Consumer Goods',
  'Energy',
  'Utilities',
  'Real Estate',
  // Add more topics as needed
];

const FetchIPOData = () => {
  const [symbol, setSymbol] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to fetch data
  const fetchData = async (queryString) => {
    setLoading(true);
    try {
      const response = await fetch(`https://devsalman.tech/stock-news?${queryString}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch general news on component mount
  useEffect(() => {
    fetchData('');
  }, []);

  // Update URL and fetch data when topics change
  useEffect(() => {
    const queryString = new URLSearchParams({
      symbol,
      topics: selectedTopics,
    }).toString();
    router.push(`?${queryString}`);
    fetchData(queryString);
  }, [selectedTopics]);

  // Handle topic change
  const handleTopicChange = (event) => {
    const { value, checked } = event.target;
    setSelectedTopics((prevTopics) =>
      checked ? [...prevTopics, value] : prevTopics.filter((topic) => topic !== value)
    );
  };

  return (
    <div className="w-[50%] m-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-4">Fetch IPO Calendar Data</h1>
      <input
        type="text"
        placeholder="Enter symbol (optional)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full text-black p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
      <div className="w-full text-black p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300">
        {topicsList.map((topic) => (
          <div key={topic}>
            <input
              type="checkbox"
              value={topic}
              checked={selectedTopics.includes(topic)}
              onChange={handleTopicChange}
              className="mr-2"
            />
            {topic}
          </div>
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-message"></div>
        </div>
      )}

      {error && <p className="text-red-500">{`Error: ${error}`}</p>}
      {data && (
        <div className="mt-4">
          <h2 className="text-lg text-black font-semibold">Response Data:</h2>
          {data.feed && data.feed.length > 0 ? (
            data.feed.map((item, index) => (
              <div key={index} className="data-item mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                <h3 className="text-lg text-black font-bold">{item.title}</h3>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Read more
                </a>
                <p className="text-gray-600">{item.summary}</p>
                <img src={item.banner_image} alt={item.title} className="w-full h-48 object-cover rounded-md my-2" />
                <p className="text-gray-500">Published: {new Date(item.time_published).toLocaleString()}</p>
                <p className="text-gray-500">Source: {item.source} ({item.category_within_source})</p>
                <div className="mt-2">
                  <h4 className="font-semibold text-black">Authors:</h4>
                  <ul className='text-black'>
                    {item.authors.map((author, i) => (
                      <li key={i}>{author}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <h4 className="font-semibold text-black">Sentiment:</h4>
                  <p>{item.overall_sentiment_label} (Score: {item.overall_sentiment_score})</p>
                </div>
                <div className="mt-2 text-black">
                  <h4 className="font-semibold text-black">Ticker Sentiments:</h4>
                  <ul className='text-black'>
                    {item.ticker_sentiment.map((ticker, i) => (
                      <li key={i}>
                        {ticker.ticker}: {ticker.ticker_sentiment_label} (Score: {ticker.ticker_sentiment_score})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FetchIPOData;
