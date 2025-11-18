import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Contract {
  id: number;
  adoption_fee: number;
  Application: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
  };
  Animal: {
    unique_id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    adoption_fee: number;
    image_urls: string[];
  };
}

export default function PublicContractPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Form state
  const [termsAccepted, setTermsAccepted] = useState({
    term1: false,
    term2: false,
    term3: false,
    term4: false,
    term5: false,
  });
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [signatureMethod, setSignatureMethod] = useState<'typed' | 'canvas'>('typed');
  const [typedSignature, setTypedSignature] = useState('');
  const [signDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  
  // Fetch contract by token
  useEffect(() => {
    const fetchContract = async () => {
      if (!token) {
        setError('Invalid contract link. No token provided.');
        setLoading(false);
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/api/contracts/token/${token}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load contract');
        }
        
        const data = await response.json();
        setContract(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load contract. The link may be invalid or expired.');
        console.error('Error fetching contract:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [token]);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);
  
  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      setIsDrawing(true);
      setHasDrawnSignature(true);
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasDrawnSignature(false);
    }
  };
  
  // Handle payment proof upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Form validation
  const validateForm = () => {
    const allTermsAccepted = Object.values(termsAccepted).every(v => v);
    if (!allTermsAccepted) {
      toast.error('Please accept all terms and conditions');
      return false;
    }
    
    if (!paymentProof) {
      toast.error('Please upload payment proof (EMT screenshot)');
      return false;
    }
    
    if (signatureMethod === 'typed' && !typedSignature.trim()) {
      toast.error('Please provide your signature');
      return false;
    }
    
    if (signatureMethod === 'canvas' && !hasDrawnSignature) {
      toast.error('Please draw your signature');
      return false;
    }
    
    return true;
  };
  
  // Submit contract
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get signature data
      let signature = '';
      if (signatureMethod === 'typed') {
        signature = typedSignature;
      } else {
        const canvas = canvasRef.current;
        if (canvas) {
          signature = canvas.toDataURL('image/png');
        }
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/contracts/token/${token}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_proof: paymentProof,
          signature: signature,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit contract');
      }
      
      toast.success('Contract submitted successfully!');
      setSubmitSuccess(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit contract. Please try again.');
      console.error('Error submitting contract:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-spinner fa-spin text-blue-600 dark:text-blue-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Loading Contract...</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we load your adoption contract.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !contract) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Contract Not Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                {error || 'We couldn\'t find the contract you are looking for.'}
              </p>
              <a 
                href="/" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (submitSuccess) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-check text-green-600 dark:text-green-400 text-5xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Congratulations! 🎉
              </h2>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Contract Completed Successfully
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Your adoption contract for <strong>{contract.Animal.name}</strong> has been successfully submitted. 
                We've sent a confirmation email to <strong>{contract.Application.email}</strong>.
              </p>
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8 max-w-md">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">Next Steps:</h4>
                <ul className="text-left text-green-700 dark:text-green-400 space-y-2">
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-3"></i>
                    <span>We'll review your payment proof</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-3"></i>
                    <span>Prepare your home for {contract.Animal.name}</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-check-circle mt-1 mr-3"></i>
                    <span>We'll contact you to arrange pickup</span>
                  </li>
                </ul>
              </div>
              <a 
                href="/" 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Return to Home
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-6">
              {contract.Animal.image_urls && contract.Animal.image_urls.length > 0 && (
                <img 
                  src={contract.Animal.image_urls[0]} 
                  alt={contract.Animal.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Adoption Contract
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  For <strong>{contract.Animal.name}</strong> ({contract.Animal.species} - {contract.Animal.breed})
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Animal ID: {contract.Animal.unique_id}
                </p>
              </div>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Adopter Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-semibold">Name:</span> {contract.Application.full_name}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {contract.Application.email}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {contract.Application.phone}
              </div>
              <div>
                <span className="font-semibold">Adoption Fee:</span> ${contract.Animal.adoption_fee}
              </div>
            </div>
          </div>

          {/* Contract Form */}
          <form onSubmit={handleSubmit}>
            {/* Terms and Conditions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Terms and Conditions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please read and accept the following terms and conditions:
              </p>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted.term1}
                    onChange={(e) => setTermsAccepted({ ...termsAccepted, term1: e.target.checked })}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    I understand that I am responsible for the animal's health, safety, and well-being.
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted.term2}
                    onChange={(e) => setTermsAccepted({ ...termsAccepted, term2: e.target.checked })}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    I agree to provide proper veterinary care including regular check-ups and vaccinations.
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted.term3}
                    onChange={(e) => setTermsAccepted({ ...termsAccepted, term3: e.target.checked })}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    I will not transfer, sell, or give away this animal without prior written consent from SFP Portal.
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted.term4}
                    onChange={(e) => setTermsAccepted({ ...termsAccepted, term4: e.target.checked })}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    I understand that if I can no longer care for this animal, I will return it to SFP Portal.
                  </span>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted.term5}
                    onChange={(e) => setTermsAccepted({ ...termsAccepted, term5: e.target.checked })}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    I confirm that all information provided in my application is true and accurate.
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Proof Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Payment Proof (EMT Screenshot)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please upload a screenshot of your EMT transfer for the adoption fee of <strong>${contract.Animal.adoption_fee}</strong>
              </p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 dark:text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-blue-900 dark:file:text-blue-300
                  cursor-pointer"
              />
              
              {paymentProof && (
                <div className="mt-4">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-2">✓ File uploaded successfully</p>
                  <img 
                    src={paymentProof} 
                    alt="Payment proof preview" 
                    className="max-w-md rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Signature
              </h2>
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-3">Signature Method:</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSignatureMethod('typed')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                      signatureMethod === 'typed'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Type Signature
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMethod('canvas')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                      signatureMethod === 'canvas'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Draw Signature
                  </button>
                </div>
              </div>
              
              {signatureMethod === 'typed' ? (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Type your full name as signature:
                  </label>
                  <input
                    type="text"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontFamily: 'cursive', fontSize: '1.5rem' }}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Draw your signature below:
                  </label>
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair bg-white"
                  />
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="mt-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <i className="fa-solid fa-eraser mr-2"></i>
                    Clear Signature
                  </button>
                </div>
              )}
              
              <div className="mt-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Sign Date:</label>
                <input
                  type="date"
                  value={signDate}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                    bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                  text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Submitting Contract...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-file-signature"></i>
                    Submit Contract
                  </>
                )}
              </button>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                By submitting this contract, you agree to all terms and conditions stated above.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
