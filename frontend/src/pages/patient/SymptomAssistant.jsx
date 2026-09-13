import { apiUrl } from "../../Api/Api";
import { useState, useRef, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Bot, Send, AlertTriangle, Heart } from 'lucide-react';

// Temporary symptom information.
// Later, this can also be moved to a backend API.
const SYMPTOM_RESPONSES = {
  fever: {
    info: "Fever can occur with infections or other conditions. Monitor your temperature and seek medical care if it is severe, persistent, or accompanied by concerning symptoms.",
    suggestions: [
      "Stay hydrated",
      "Get adequate rest",
      "Monitor your temperature",
      "Consult a healthcare professional if symptoms persist or worsen",
    ],
    department: "General Medicine",
    severity: "mild",
  },

  headache: {
    info: "Headaches can have many causes including stress, dehydration, lack of sleep, or illness.",
    suggestions: [
      "Stay hydrated",
      "Rest in a quiet environment",
      "Get adequate sleep",
      "Consult a doctor if headaches are severe or persistent",
    ],
    department: "General Medicine",
    severity: "mild",
  },

  cough: {
    info: "Cough can occur with respiratory infections, allergies, or other conditions.",
    suggestions: [
      "Stay hydrated",
      "Rest adequately",
      "Avoid smoke and other irritants",
      "Consult a doctor if breathing becomes difficult",
    ],
    department: "General Medicine",
    severity: "moderate",
  },

  "chest pain": {
    info: "Chest pain can have many causes and should not be ignored, especially when severe or sudden.",
    suggestions: [
      "Seek medical attention promptly",
      "Do not ignore severe or persistent chest pain",
      "Seek emergency care if accompanied by breathing difficulty, sweating, or fainting",
    ],
    department: "Cardiology",
    severity: "high",
  },

  "skin rash": {
    info: "Skin rashes can have many causes including allergies, infections, or irritation.",
    suggestions: [
      "Avoid scratching the affected area",
      "Avoid products that may irritate the skin",
      "Keep the area clean",
      "Consult a doctor if the rash spreads or becomes severe",
    ],
    department: "Dermatology",
    severity: "moderate",
  },

  "joint pain": {
    info: "Joint pain can result from injury, inflammation, overuse, or other conditions.",
    suggestions: [
      "Rest the affected joint",
      "Avoid activities that increase the pain",
      "Monitor swelling or worsening symptoms",
      "Consult a healthcare professional if pain persists",
    ],
    department: "Orthopedics",
    severity: "moderate",
  },

  "eye pain": {
    info: "Eye pain can have several causes and may require professional examination.",
    suggestions: [
      "Avoid rubbing your eyes",
      "Take breaks from screens",
      "Avoid using eye drops without professional advice",
      "Consult an eye-care professional if pain persists or vision changes",
    ],
    department: "Ophthalmology",
    severity: "moderate",
  },

  "sore throat": {
    info: "A sore throat can occur with infections, allergies, or irritation.",
    suggestions: [
      "Stay hydrated",
      "Rest adequately",
      "Avoid smoking and other irritants",
      "Consult a doctor if symptoms become severe or persistent",
    ],
    department: "General Medicine",
    severity: "mild",
  },

  "stomach pain": {
    info: "Stomach pain can have many causes, ranging from minor digestive problems to conditions requiring medical evaluation.",
    suggestions: [
      "Stay hydrated",
      "Rest",
      "Avoid foods that worsen symptoms",
      "Consult a doctor if pain is severe or persistent",
    ],
    department: "Gastroenterology",
    severity: "moderate",
  },

  "breathing difficulty": {
    info: "Breathing difficulty can sometimes indicate a serious medical problem and should be taken seriously.",
    suggestions: [
      "Seek medical attention promptly",
      "Sit upright and remain calm",
      "Do not ignore worsening breathing difficulty",
      "Seek emergency care if breathing becomes severely difficult",
    ],
    department: "Pulmonology",
    severity: "high",
  },
};

export default function SymptomAssistant() {
  const [input, setInput] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! 👋 I'm your Health Information Assistant. Tell me about your symptoms and I'll provide general health information and suggest which department might be helpful.",
    },
    {
      id: 2,
      type: 'disclaimer',
      text: "⚠️ IMPORTANT DISCLAIMER: This assistant provides general health information only. It does NOT provide medical diagnoses, treatment recommendations, or replace professional medical advice. Always consult a qualified healthcare professional for medical concerns.",
    },
  ]);

  const chatEnd = useRef(null);

  // Fetch real doctors and departments from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsResponse, departmentsResponse] = await Promise.all([
          fetch(apiUrl('/api/doctors')),
          fetch(apiUrl('/api/departments')),
        ]);

        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors');
        }

        if (!departmentsResponse.ok) {
          throw new Error('Failed to fetch departments');
        }

        const doctorsData = await doctorsResponse.json();
        const departmentsData = await departmentsResponse.json();

        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        setDepartments(
          Array.isArray(departmentsData) ? departmentsData : []
        );
      } catch (error) {
        console.error(
          'Error fetching doctors/departments:',
          error
        );
      }
    };

    fetchData();
  }, []);

  // Automatically scroll to newest message
  useEffect(() => {
    chatEnd.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userInput = input.trim();

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userInput,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Find matching symptom
    const inputLower = userInput.toLowerCase();

    let response = null;

    for (const [key, value] of Object.entries(SYMPTOM_RESPONSES)) {
      if (inputLower.includes(key)) {
        response = {
          ...value,
          keyword: key,
        };
        break;
      }
    }

    setTimeout(() => {
      if (response) {
        // Find the recommended department from real backend data
        const dept = departments.find(
          (d) => d.name === response.department
        );

        // Find doctors from real backend data
        const deptDoctors = doctors.filter(
          (doctor) =>
            doctor.department === response.department &&
            doctor.status === 'active'
        );

        const botMsg = {
          id: Date.now() + 1,
          type: 'bot-response',
          data: {
            keyword: response.keyword,
            info: response.info,
            suggestions: response.suggestions,
            department:
              dept?.name || response.department,
            severity: response.severity,
            doctors: deptDoctors.slice(0, 3),
          },
        };

        setMessages((prev) => [...prev, botMsg]);
      } else {
        const botMsg = {
          id: Date.now() + 1,
          type: 'bot',
          text: "I understand you're not feeling well. Unfortunately, I couldn't match your description to a specific symptom in my database. Please try describing your symptoms using common terms like: fever, headache, chest pain, cough, skin rash, joint pain, eye pain, sore throat, stomach pain, or breathing difficulty.",
        };

        setMessages((prev) => [...prev, botMsg]);
      }
    }, 800);

    setInput('');
  };

  const severityColor = {
    mild: 'success',
    moderate: 'warning',
    high: 'danger',
  };

  return (
    <div
      id="symptom-assistant-page"
      className="max-w-3xl mx-auto space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center animate-float">
          <Bot size={32} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Health Information Assistant
        </h1>

        <p className="text-[var(--text-secondary)] mt-1">
          Describe your symptoms to get general health information
        </p>
      </div>

      {/* Chat Container */}
      <Card
        padding="p-0"
        className="h-[60vh] flex flex-col"
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            {/* User message */}
            if (msg.type === 'user') {
              return (
                <div
                  key={msg.id}
                  className="flex justify-end animate-fade-in"
                >
                  <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-primary-600 text-white">
                    <p className="text-sm">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            }

            {/* Disclaimer */}
            if (msg.type === 'disclaimer') {
              return (
                <div
                  key={msg.id}
                  className="animate-fade-in"
                >
                  <div className="px-4 py-3 rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 text-sm text-warning-700 dark:text-warning-400">
                    {msg.text}
                  </div>
                </div>
              );
            }

            {/* Normal bot message */}
            if (msg.type === 'bot') {
              return (
                <div
                  key={msg.id}
                  className="flex justify-start animate-fade-in"
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot
                        size={16}
                        className="text-primary-500"
                      />
                    </div>

                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                      <p className="text-sm">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            {/* Bot response */}
            if (msg.type === 'bot-response') {
              const d = msg.data;

              return (
                <div
                  key={msg.id}
                  className="flex justify-start animate-fade-in-up"
                >
                  <div className="flex gap-3 max-w-[90%]">
                    <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot
                        size={16}
                        className="text-primary-500"
                      />
                    </div>

                    <div className="space-y-3">
                      {/* Information */}
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--bg-tertiary)]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-[var(--text-primary)] capitalize">
                            {d.keyword}
                          </span>

                          <Badge
                            variant={
                              severityColor[d.severity]
                            }
                            size="xs"
                          >
                            {d.severity === 'high'
                              ? 'âš ï¸ Seek care'
                              : `${d.severity} severity`}
                          </Badge>
                        </div>

                        <p className="text-sm text-[var(--text-secondary)]">
                          {d.info}
                        </p>
                      </div>

                      {/* Suggestions */}
                      <div className="px-4 py-3 rounded-2xl bg-accent-50 dark:bg-accent-500/10">
                        <p className="text-xs font-semibold text-accent-700 dark:text-accent-400 mb-2">
                          ðŸ’¡ General Suggestions
                        </p>

                        <ul className="space-y-1">
                          {d.suggestions.map(
                            (suggestion, index) => (
                              <li
                                key={index}
                                className="text-sm text-[var(--text-secondary)] flex items-start gap-2"
                              >
                                <span className="text-accent-500 mt-0.5">
                                  â€¢
                                </span>

                                {suggestion}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Department Recommendation */}
                      <div className="px-4 py-3 rounded-2xl bg-primary-50 dark:bg-primary-900/20">
                        <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-2">
                          ðŸ¥ Recommended Department:{' '}
                          {d.department}
                        </p>

                        {d.doctors.length > 0 && (
                          <div className="space-y-2">
                            {d.doctors.map((doctor) => (
                              <div
                                key={
                                  doctor._id ||
                                  doctor.id
                                }
                                className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                              >
                                <Heart
                                  size={12}
                                  className="text-primary-500"
                                />

                                <span>
                                  {doctor.name}
                                </span>

                                {doctor.rating !==
                                  undefined && (
                                  <span className="text-xs text-[var(--text-tertiary)]">
                                    · ★ {doctor.rating}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {d.doctors.length === 0 && (
                          <p className="text-xs text-[var(--text-tertiary)]">
                            No active doctors found in this department.
                          </p>
                        )}
                      </div>

                      {/* Disclaimer */}
                      <div className="px-3 py-2 rounded-lg bg-warning-50 dark:bg-warning-500/5 border border-warning-100 dark:border-warning-500/20">
                        <p className="text-xs text-warning-600 dark:text-warning-400 flex items-center gap-1">
                          <AlertTriangle size={12} />

                          This is general health information only,
                          not a medical diagnosis. Please consult a
                          doctor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          <div ref={chatEnd} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--border-color)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === 'Enter' && handleSend()
              }
              placeholder="Describe your symptoms (e.g., 'I have a fever and headache')..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />

            <Button
              onClick={handleSend}
              icon={Send}
              disabled={!input.trim()}
            >
              Send
            </Button>
          </div>

          <p className="text-[10px] text-[var(--text-tertiary)] mt-2 text-center">
            This tool provides general health information only.
            It does not diagnose, treat, or offer medical advice.
          </p>
        </div>
      </Card>

      {/* Quick Symptoms */}
      <Card>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
          Try asking about:
        </p>

        <div className="flex flex-wrap gap-2">
          {Object.keys(SYMPTOM_RESPONSES).map(
            (symptom) => (
              <button
                key={symptom}
                onClick={() => {
                  setInput(`I have ${symptom}`);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 transition-colors cursor-pointer capitalize"
              >
                {symptom}
              </button>
            )
          )}
        </div>
      </Card>
    </div>
  );
}


