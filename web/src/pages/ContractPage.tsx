import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ContractPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Redirect to new sign contract page
  useEffect(() => {
    navigate(`/sign-contract/${id}`);
  }, [id, navigate]);
  
  return (
    <div className="min-h-screen py-12 bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <i className="fa-solid fa-spinner fa-spin text-gray-400 text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Redirecting...</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            We are redirecting you to the new contract signing page.
          </p>
        </div>
      </div>
    </div>
  );
}