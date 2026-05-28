import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function App() {
  return (
    <>
      <Helmet>
        <title>EA Sports FC 26 | Dashboard</title>
        <meta name="description" content="EA Sports FC 26 Men's Football Dataset Dashboard" />
      </Helmet>
      
      <Routes>
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              EA Sports FC 26 Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome to the Football Dataset Project. Frontend Setup Complete!
            </p>
          </div>
        } />
        {/* Protected routes will be added in next features */}
      </Routes>
    </>
  );
}

export default App;
