"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalApi from "@/app/_services/GlobalApi";
import toast, { Toaster } from "react-hot-toast";
import { encryptText } from "@/utils/encryption";
import { Heart, CheckCircle, ArrowRight, AlertCircle, Flag, Loader2, X, ChevronLeft } from "lucide-react";

const ModernCompatibilityQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [redFlags, setRedFlags] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(null);
  const [showRedFlagInfo, setShowRedFlagInfo] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const authCheck = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      }
    };
    authCheck();
  }, [router]);

  useEffect(() => {
    const getQuizData = async () => {
      setIsLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resp = await GlobalApi.GetCompatabilityQuiz(token);

        if (resp.data.quizCompleted) {
          setQuizCompleted(true);
        } else {
          setQuestions(resp.data.questions);
          setCurrentQuestionIndex(resp.data.quizProgress);

          // Calculate progress
          if (resp.data.questions?.length > 0) {
            setProgress((resp.data.quizProgress / resp.data.questions.length) * 100);
          }

          if (resp.data.quizProgress > 0) {
            setShowAlert(true);
          }
        }
        
        // Get user's existing red flags
        try {
          const redFlagsResp = await GlobalApi.GetRedFlags(token);
          if (redFlagsResp.status === 200 && redFlagsResp.data.redFlags) {
            // Extract just the answer IDs from the response
            const redFlagIds = redFlagsResp.data.redFlags.map(flag => flag.answer_id);
            setRedFlags(redFlagIds);
          }
        } catch (redFlagError) {
          console.error("Error fetching red flags:", redFlagError);
          // Non-critical error, don't show toast to user
        }
      } catch (error) {
        console.error("Error Fetching GetQuizData data:", error);
        toast.error("Failed to load quiz questions");
      } finally {
        setIsLoading(false);
      }
    };
    getQuizData();
  }, []);

  useEffect(() => {
    const checkInvite = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resp = await GlobalApi.CheckInvites(token);

        if (typeof resp.data.inviteStatus !== "undefined") {
          setInviteStatus(resp.data.inviteStatus);
        } else {
          setInviteStatus(true);
        }

        const timer = setTimeout(() => {
          if (resp.data.inviteStatus === true || typeof resp.data.inviteStatus === "undefined") {
            router.replace("/taketest");
          } else if (resp.data.inviteStatus === false) {
            const userIdToEncrypt = String(resp.data.inviterId);
            const encryptedUserId = encryptText(userIdToEncrypt);
            router.replace(`/compatibility-check?userId=${encodeURIComponent(encryptedUserId)}`);
          }
        }, 5000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error Fetching checkInvite status:", error);
      }
    };

    if (quizCompleted) {
      checkInvite().then(() => {
        const interval = setInterval(() => {
          setSecondsRemaining((prevSeconds) => {
            if (prevSeconds <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prevSeconds - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      });
    }
  }, [quizCompleted, router]);

  useEffect(() => {
    if (questions?.length > 0) {
      const choices = questions[currentQuestionIndex]?.answers;
      setChoices(choices || []);
      
      // Update progress when question changes
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    }
  }, [currentQuestionIndex, questions]);

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
  };

  const toggleRedFlag = async (choice) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (redFlags.includes(choice.id)) {
      // Remove from local state first for immediate UI feedback
      setRedFlags(redFlags.filter(id => id !== choice.id));
      
      // Then remove from database
      try {
        await GlobalApi.RemoveRedFlag(choice.id, token);
      } catch (error) {
        console.error("Error removing red flag:", error);
        toast.error("Failed to remove red flag");
        // Restore the red flag in local state if API call fails
        setRedFlags(prev => [...prev, choice.id]);
      }
    } else {
      // Check local state first
      if (redFlags.length < 3) {
        // Add to local state for immediate UI feedback
        setRedFlags([...redFlags, choice.id]);
        
        // Then add to database
        try {
          const response = await GlobalApi.SaveRedFlag({
            answerId: choice.id
          }, token);
          
          // If there's an API error (like already having 3 flags in DB)
          if (response.status !== 201) {
            // Remove from local state
            setRedFlags(prev => prev.filter(id => id !== choice.id));
            toast.error(response.data.message || "Failed to save red flag");
          }
        } catch (error) {
          console.error("Error adding red flag:", error);
          toast.error("Failed to save red flag");
          // Remove from local state if API call fails
          setRedFlags(prev => prev.filter(id => id !== choice.id));
        }
      } else {
        toast.error("You can only select up to 3 red flags across all questions");
      }
    }
  };

  const handleNext = async () => {
    if (!selectedChoice) return;

    const answer = {
      questionId: questions[currentQuestionIndex].id,
      optionId: selectedChoice.id,
      optionText: selectedChoice.text,
      points: selectedChoice.points,
    };

    // Save regular progress
    await quizProgressSubmit(answer);
    
    // No need to save red flags here, as they're saved immediately when toggled
    // and removed from our tracking array

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedChoice(null);
    } else {
      setQuizCompleted(true);
      quizSubmit();
    }
  };

  const saveRedFlags = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      // For each red flag, save to the user_red_flags table
      for (const answerId of redFlags) {
        await GlobalApi.SaveRedFlag({
          answerId: answerId
        }, token);
      }
      
      // Clear red flags after saving
      setRedFlags([]);
    } catch (error) {
      console.error("Error saving red flags:", error);
      toast.error("Failed to save red flags. Please try again.");
    }
  };

  const quizProgressSubmit = async (data) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const resp = await GlobalApi.SaveCompatabilityProgress(data, token);

      if (resp && resp.status !== 201) {
        console.error("Failed to save progress. Status code:", resp.status);
        toast.error("Failed to save progress. Please check your connection.");
      }
    } catch (error) {
      console.error("Error submitting progress:", error);
      toast.error("Failed to save progress. Please try again.");
    }
  };

  const quizSubmit = async () => {
    setIsLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const resp = await GlobalApi.SaveCompatabilityResult(token);
      if (resp && resp.status === 201) {
        toast.success("Quiz Completed successfully!");
      } else {
        toast.error("Failed to submit quiz.");
      }
    } catch (error) {
      console.error("Error submitting quiz", error);
      toast.error("Error: Failed to submit quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Loading your quiz...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your questions</p>
        </div>
      </div>
    );
  }

  // Quiz completed state
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Quiz Completed!
          </h2>
          <p className="text-gray-600 mb-6">
            {inviteStatus === true
              ? "Redirecting to copy the invite link"
              : inviteStatus === false
              ? "Redirecting to the compatibility check page"
              : "Thank you for completing the quiz. Your responses have been saved."}
          </p>
          <div className="flex items-center justify-center text-gray-500 mb-4">
            <p>Redirecting in {secondsRemaining} seconds</p>
          </div>
        </div>
      </div>
    );
  }

  // Red Flag Info Modal
  const RedFlagInfoModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Flag className="h-5 w-5 text-red-500 mr-2" />
            Red Flags
          </h3>
          <button 
            onClick={() => setShowRedFlagInfo(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-3">
          Red flags are traits or behaviors you consider dealbreakers in a relationship.
        </p>
        <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-2">
          <li>You can mark up to 3 options as red flags across all questions</li>
          <li>These will be used to filter potential matches</li>
          <li>Click the flag icon next to any option to mark/unmark it as a red flag</li>
        </ul>
        <div className="flex justify-end">
          <button
            onClick={() => setShowRedFlagInfo(false)}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-red-500 flex flex-col items-center py-6 px-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
      
      {showRedFlagInfo && <RedFlagInfoModal />}
      
      {/* Header with branding */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-white mr-2" />
          <span className="text-xl font-bold text-white">Qoupled</span>
        </div>
        
        <button 
          onClick={() => setShowRedFlagInfo(true)}
          className="flex items-center bg-white/10 hover:bg-white/20 transition-colors text-white py-1 px-3 rounded-lg text-sm"
        >
          <Flag className="h-4 w-4 mr-1" />
          <span>What are red flags?</span>
        </button>
      </div>
      
      {/* Quiz progress alert */}
      {showAlert && (
        <div className="w-full max-w-4xl mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Quiz in Progress</h3>
              <p className="text-sm text-amber-700 mt-1">
                You're continuing from where you left off. Your previous answers have been saved.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Question {currentQuestionIndex + 1}</span>
          <span className="text-white font-medium">{currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="overflow-hidden h-2 bg-white/30 rounded-full">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Red flags counter */}
      <div className="w-full max-w-4xl mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg py-2 px-4 flex items-center">
          <Flag className="h-5 w-5 text-white mr-2" />
          <span className="text-white text-sm font-medium">
            Red flags selected: {redFlags.length}/3
          </span>
        </div>
      </div>
      
      {/* Question card */}
      {questions.length > 0 && (
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Question header */}
            <div className="bg-gradient-to-r from-rose-500 to-red-600 p-6">
              <h2 className="text-xl font-bold text-white">
                {questions[currentQuestionIndex]?.question}
              </h2>
            </div>
            
            {/* Answer options */}
            <div className="p-6">
              <div className="space-y-4">
                {choices.map((choice, index) => (
                  <div key={index} className="relative">
                    <button
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 flex items-center ${
                        selectedChoice?.id === choice.id 
                          ? 'border-rose-500 bg-rose-50 text-rose-700' 
                          : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
                      }`}
                      onClick={() => handleChoiceSelect(choice)}
                    >
                      <div className="h-6 w-6 min-w-6 rounded-full mr-3 flex-shrink-0 border-2 flex items-center justify-center 
                        ${selectedChoice?.id === choice.id ? 'border-rose-500 bg-rose-500' : 'border-gray-300'}">
                        {selectedChoice?.id === choice.id && (
                          <CheckCircle className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{choice.text}</span>
                    </button>
                    
                    {/* Red flag button */}
                    <button 
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                        redFlags.includes(choice.id) 
                          ? 'bg-red-100 text-red-500' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleRedFlag(choice)}
                      title={redFlags.includes(choice.id) ? "Remove red flag" : "Mark as red flag"}
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                  }
                }}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentQuestionIndex === 0 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-rose-600'
                }`}
              >
                <ChevronLeft className="mr-1 h-5 w-5" />
                <span>Previous</span>
              </button>
              
              <button
                onClick={handleNext}
                disabled={!selectedChoice}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedChoice 
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-lg' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {currentQuestionIndex === questions.length - 1 ? "Complete" : "Next"}
                </span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernCompatibilityQuiz;