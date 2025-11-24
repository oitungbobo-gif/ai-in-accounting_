import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, ArrowLeft, Brain, Users, CheckCircle, Database, Zap,
  FileText, Shield, Terminal, MessageSquare, BookOpen,
  Lock, Search, CheckSquare, Settings, Mail, Cpu,
  DollarSign, FileSpreadsheet, UserCheck, AlertTriangle, HelpCircle, Send, X, Sparkles, Bot, Calculator
} from 'lucide-react';

// --- Gemini API Helper ---
const callGeminiAPI = async (prompt, systemInstruction = "") => {
  const apiKey = ""; // Provided at runtime
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };

  // Retry logic (exponential backoff)
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response this time.";
    } catch (error) {
      if (attempt === 4) {
          console.error("Gemini API Error:", error);
          return "Unable to connect to AI service. Please check your connection or try again later.";
      }
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// --- Chatbot Component ---
const ChatbotComponent = ({ currentSlide, slideTitle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Helper to format messages with bold text and line breaks
    const formatMessage = (text) => {
        return text.split('\n').map((line, i) => (
            <div key={i} className={`${line.trim() === '' ? 'h-2' : ''}`}>
                {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                    part.startsWith('**') && part.endsWith('**') ?
                    <strong key={j} className="font-bold">{part.slice(2, -2)}</strong> :
                    part
                )}
            </div>
        ));
    };

    // --- RICH DATA STRUCTURE FOR SLIDE CONTEXT ---
    // Stores 5+ specific examples for Summary, Real World, and Importance per slide.
    const slideContentData = {
        0: { // Intro
            summary: "We are upgrading finance from manual data entry to strategic insight. Think of AI as an infinite capacity assistant that handles the boring stuff so you can focus on value.",
            examples: [
                "📉 -> 📈: Instead of typing invoice numbers, you scan a PDF and AI fills the SAP fields automatically.",
                "💡: Instead of manually categorizing expenses, AI suggests 'Travel' based on the vendor 'Uber'.",
                "💡: You ask 'What was our T&E spend last Q3?' and get an instant chart without running a report.",
                "💡: AI flags a $50,000 payment to a new vendor for manual review before it goes out.",
                "💡: Drafting a policy update email to the whole company in 30 seconds instead of 30 minutes."
            ],
            importance: [
                "🚀 It stops us from being 'data janitors' and makes us 'data architects'.",
                "🚀 It handles the sheer volume of data that is becoming impossible for humans to manage manually.",
                "🚀 It reduces the 'fatigue factor' where human eyes miss errors after staring at spreadsheets for hours.",
                "🚀 It allows the finance team to scale with the company without just hiring more bodies.",
                "🚀 It frees up mental energy for the complex problem-solving that actually drives business value."
            ]
        },
        1: { // Why AI Matters
            summary: "AI upgrades your role, speeds up the close, acts as a trusted advisor, catches mistakes 24/7, and ensures compliance.",
            examples: [
                "💡: Closing the books: AI matches 99% of intercompany transactions automatically, saving days.",
                "💡: Compliance: AI scans thousands of transactions against new lease accounting standards instantly.",
                "💡: Advisory: You ask AI to analyze customer churn vs. discounts given, revealing a bad strategy.",
                "💡: Error Catching: It flags a duplicate invoice that had a slightly different invoice number format (INV-01 vs INV01).",
                "💡: Speed: Generating a preliminary board deck with charts in minutes instead of hours."
            ],
            importance: [
                "🚀 Speed to insight: Management needs numbers *now*, not in 3 weeks.",
                "🚀 Risk reduction: 100% sampling vs random sampling in audit.",
                "🚀 Cost savings: Preventing overpayments and fraud adds directly to the bottom line.",
                "🚀 Employee satisfaction: Nobody likes data entry; removing it reduces burnout.",
                "🚀 Credibility: Fewer manual errors means the business trusts the finance numbers more."
            ]
        },
        2: { // Core Modules
            summary: "The 4 pillars of this training are: 1. Mindset (Partner), 2. Prompting (The Ask), 3. Workflows (The Process), and 4. Responsibility (The Ethics).",
            examples: [
                "💡: Mindset: Viewing AI as a 'junior analyst' to delegate research to, not a magic button.",
                "💡: Prompting: Learning to ask 'Find the outlier' instead of just 'Show me the data'.",
                "💡: Workflows: Setting up an auto-forward rule for invoices to the AI processor.",
                "💡: Responsibility: Checking the AI's tax memo against the actual IRS code.",
                "💡: Integration: Using AI to connect data between Salesforce and NetSuite without code."
            ],
            importance: [
                "🚀 A tool is only as good as the user; training ensures we use it safely.",
                "🚀 Bad prompts lead to bad financial advice; precision is key in accounting.",
                "🚀 Understanding workflows prevents 'automation silos' where only one person knows how it works.",
                "🚀 Responsible use protects the company from data leaks and reputational damage.",
                "🚀 It provides a structured learning path so the team isn't overwhelmed."
            ]
        },
        3: { // Mindset Game
            summary: "AI handles high-volume, repetitive tasks (Data Entry). Humans handle high-value, strategic tasks (Empathy, Judgment).",
            examples: [
                "🤖 AI Task: Sorting 5,000 bank transaction lines by category.",
                "🧠 Human Task: Deciding if a 'Miscellaneous' expense is actually a bribe risk.",
                "🤖 AI Task: Calculating depreciation schedules for 200 assets.",
                "🧠 Human Task: Negotiating a payment plan with a struggling long-term client.",
                "🤖 AI Task: Translating foreign subsidiary financial statements."
            ],
            importance: [
                "🚀 Knowing the difference prevents us from trusting AI with 'judgment calls' it can't make.",
                "🚀 It highlights our value: Empathy, Ethics, and Strategy cannot be automated.",
                "🚀 It prevents fear: We see AI as taking the 'robot work' out of the human.",
                "🚀 It improves efficiency: We don't waste human brainpower on rote matching.",
                "🚀 It clarifies accountability: The human is always the final signer."
            ]
        },
        4: { // Prompting
            summary: "To get good answers, follow the 4 Rules: 1. Be Specific, 2. Give a Role, 3. Set a Goal, 4. Choose a Format.",
            examples: [
                "💡: Role: 'Act as a Credit Controller. Write a polite dunning email for a 30-day overdue account.'",
                "💡: Context: 'Given we are a SaaS company, analyze these metrics...'",
                "💡: Goal: 'I need to reduce T&E spend. Analyze this report and find the top 3 areas to cut.'",
                "💡: Format: 'Output the answer as a CSV table I can paste into Excel.'",
                "💡: Constraint: 'Explain this variance to a non-finance manager using simple analogies.'"
            ],
            importance: [
                "🚀 AI models are literal; vague instructions produce generic, useless nonsense.",
                "🚀 Good prompting saves time by reducing the need for follow-up questions.",
                "🚀 It unlocks advanced capabilities; giving a 'Role' makes the AI access specific domain knowledge.",
                "🚀 Standardized prompting ensures consistent results across the team.",
                "🚀 It transforms the AI from a search engine into a creative consultant."
            ]
        },
        5: { // Workflows
            summary: "Don't just automate everything. 1. Find Slow Spots, 2. Clean Up Steps, 3. Place Automation (Assistant vs Engine), 4. Human Review.",
            examples: [
                "💡: Slow Spot: Manually keying data from PDF purchase orders.",
                "💡: Clean Up: Standardizing vendor names (e.g., 'IBM' vs 'I.B.M.') before analysis.",
                "💡: Assistant Mode: Using Copilot to draft the narrative for the board pack.",
                "💡: Engine Mode: A background script that auto-matches receipts to credit card transactions.",
                "💡: Review: A human checking the 'Low Confidence' matches flagged by the AI."
            ],
            importance: [
                "🚀 Automating a broken process just creates broken data faster.",
                "🚀 Identifying 'Slow Spots' ensures high ROI on automation efforts.",
                "🚀 Distinguishing between Assistant and Engine modes helps pick the right tool.",
                "🚀 The 'Review' step is the safety valve that prevents financial misstatements.",
                "🚀 It creates a culture of continuous improvement rather than 'set and forget'."
            ]
        },
        6: { // Responsible AI
            summary: "Safety first: 1. Human Verification (Review everything), 2. Data Confidentiality (No PII in public), 3. Compliance (Follow rules), 4. Audit Trails (Track usage).",
            examples: [
                "💡: Verification: You double-check the tax rate AI used because it might be outdated.",
                "💡: Confidentiality: You sanitize a contract (remove names/amounts) before asking a public AI to summarize it.",
                "💡: Compliance: You ensure the AI usage doesn't violate GDPR data processing rules.",
                "💡: Audit Trail: You save the prompt and output used to estimate a bad debt provision.",
                "💡: Bias: You ask AI for 'potential risks' in a forecast to ensure it isn't just being optimistic."
            ],
            importance: [
                "🚀 Trust is the currency of accounting; one hallucination can ruin reputation.",
                "🚀 Client data privacy is a legal and ethical absolute.",
                "🚀 Auditors will ask 'How was this number derived?'; 'The AI did it' is not an answer.",
                "🚀 It prevents 'Black Box' accounting where no one understands the numbers.",
                "🚀 It ensures we stay on the right side of evolving AI regulations."
            ]
        },
        7: { // Apps
            summary: "Use the tools you have: Excel for formulas, Outlook for emails, Word for summaries, and specialized tools for SAP retrieval.",
            examples: [
                "💡: Excel: 'Write a formula to extract the domain from these emails.'",
                "💡: Outlook: 'Summarize this 20-email thread about the budget dispute.'",
                "💡: Word: 'Convert this meeting transcript into formal meeting minutes.'",
                "💡: PowerPoint: 'Create a slide deck based on this financial report document.'",
                "💡: Teams: 'What were the action items assigned to me in the last meeting?'"
            ],
            importance: [
                "🚀 These are tools we already have access to, making adoption easy.",
                "🚀 They integrate seamlessly with our existing data (documents, emails).",
                "🚀 They reduce the 'switching cost' of moving between different apps.",
                "🚀 They provide 'enterprise-grade' security compared to random web tools.",
                "🚀 They significantly speed up the 'last mile' of finance: communication and presentation."
            ]
        },
        8: { // Simulation
            summary: "Test your skills in AR (Collections), AP (Process), GL (Classification), and Audit (SoD) to see AI in action.",
            examples: [
                "💡: AR: Drafting a sensitive email to a long-time client who stopped paying.",
                "💡: AP: Investigating why a vendor payment was rejected by the bank.",
                "💡: GL: Spotting that 'Software Licenses' was booked to 'Hardware Capex'.",
                "💡: Audit: Identifying a user who approved their own purchase requisition.",
                "💡: Tax: Summarizing the impact of a new sales tax change in a specific state."
            ],
            importance: [
                "🚀 Theory is good, but practice builds muscle memory.",
                "🚀 Simulations allow for failure in a safe environment.",
                "🚀 It demonstrates the real-world nuance: AI gives a draft, you refine the tone.",
                "🚀 It proves that AI can handle multi-step reasoning (read data -> apply rule -> output).",
                "🚀 It builds confidence for tackling real live data."
            ]
        },
        9: { // Resources
            summary: "Keep learning using Viva Learning, Prompt Guides, and internal communities.",
            examples: [
                "💡: Viva Learning: 'Introduction to Generative AI for Finance Professionals'.",
                "💡: Prompt Guide: 'The 50 Best Prompts for Financial Analysts'.",
                "💡: Internal Wiki: 'Our Company Policy on AI Data Privacy'.",
                "💡: Microsoft Learn: 'Advanced Excel Automation with Copilot'.",
                "💡: Community: The 'AI Champions' Teams channel for sharing tips."
            ],
            importance: [
                "🚀 AI changes fast; continuous learning is mandatory.",
                "🚀 Standardized resources ensure everyone plays by the same rules.",
                "🚀 Self-paced learning fits into busy finance schedules.",
                "🚀 Community learning helps spread 'best practices' viral-style.",
                "🚀 It bridges the gap between 'knowing AI exists' and 'using it daily'."
            ]
        },
        10: { // Conclusion
            summary: "Training Complete. Time saved is value gained. Start small today to build the future.",
            examples: [
                "💡: Start today: Use AI to summarize one long document.",
                "💡: Next week: Automate one weekly report draft.",
                "💡: Next month: Share a successful prompt with the team.",
                "💡: Value add: Spend the saved hour analyzing margins instead of typing.",
                "💡: Future proof: Become the 'AI expert' in your specific finance team."
            ],
            importance: [
                "🚀 Momentum matters; small wins build the habit.",
                "🚀 The goal isn't just 'saving time', it's 'reinvesting time'.",
                "🚀 It reinforces that this is a journey, not a one-time seminar.",
                "🚀 It empowers individuals to take ownership of their efficiency.",
                "🚀 It ends on a high note: You are in control of your career evolution."
            ]
        }
    };

    // --- EXTENSIVE KNOWLEDGE BASE (Definitions) ---
    const knowledgeBase = [
        {
            keywords: ["ocr", "optical character", "scanning", "pdf to text"],
            answer: "OCR (Optical Character Recognition) is the technology that converts images of text (like a scanned invoice) into machine-readable text. AI uses this to 'read' receipts and invoices automatically."
        },
        {
            keywords: ["ml", "machine learning", "pattern", "learn"],
            answer: "Machine Learning (ML) is how AI improves. Instead of being explicitly programmed for every rule, it looks at historical data (like past categorizations) to predict future ones."
        },
        {
            keywords: ["nlp", "natural language", "understand text", "read email"],
            answer: "NLP (Natural Language Processing) allows AI to understand and generate human language. This is what powers tools like Copilot to write emails or summarize contracts."
        },
        {
            keywords: ["accrual", "month end", "close"],
            answer: "For accruals, AI can analyze purchase orders and goods receipt logs to suggest precise accrual amounts, often catching items that haven't been invoiced yet."
        },
        {
            keywords: ["flux", "variance analysis", "compare"],
            answer: "AI helps with Flux Analysis by instantly comparing current actuals vs. budget or prior periods, and then generating a draft explanation based on underlying transaction details."
        },
        {
            keywords: ["excel", "spreadsheet", "formula"],
            answer: "In Excel, try asking Copilot to: 'Analyze this data for trends', 'Highlight outliers in red', or 'Write a formula to extract the domain from these email addresses'."
        },
        {
            keywords: ["present", "stakeholder", "meeting", "explain"],
            answer: "When presenting AI insights, always lead with your judgment. Say: 'The AI analysis suggests X, which I have verified and aligns with our strategy Y.'"
        },
        {
            keywords: ["private", "public", "security", "confidential", "data", "protect"],
            answer: "Public AI (like free ChatGPT) uses your data to train. Private AI (like Enterprise Copilot) keeps your data within your company's secure boundary. **Always use the Enterprise version for work.**"
        },
        {
            keywords: ["job", "replace", "career", "future", "scared"],
            answer: "AI won't replace accountants; accountants who use AI will replace those who don't. It shifts your value from 'data gathering' to 'data interpretation' and strategy."
        },
        {
            keywords: ["hallucinate", "error", "wrong", "mistake", "lie", "fact check"],
            answer: "AI can 'hallucinate' or make things up confidently. Always verify critical numbers against the source documents. You are the pilot; AI is just the co-pilot."
        },
        {
            keywords: ["start", "begin", "first step", "how to"],
            answer: "Start small! Pick one tedious task today—like summarizing a long email chain or drafting a routine vendor response—and use AI to do it. Then review the output."
        },
        {
            keywords: ["prompt", "ask", "question", "input", "write"],
            answer: "The quality of the answer depends on your prompt. Remember the 4 Rules: **Give it a Role, a Context, a Task, and a Format.** Example: 'Act as an Auditor, review this log, find anomalies, and list them in a table.'"
        },
        {
            keywords: ["audit", "risk", "compliance", "sox"],
            answer: "In Audit, AI is powerful for 100% sampling. Instead of checking 50 random invoices, AI can check 50,000 invoices for specific risk indicators like duplicate payments or weekend postings."
        },
        {
            keywords: ["ar", "receivable", "collection"],
            answer: "In AR, AI helps predict when customers will pay based on payment history, allowing you to focus collection efforts on high-risk accounts."
        },
        {
            keywords: ["ap", "payable", "invoice"],
            answer: "In AP, AI automates the '3-way match' (PO, Receipt, Invoice). It only flags the mismatches for you to fix, letting the clean ones go straight to payment."
        }
    ];

    // FIX: Restored helper function to get current context
    const getTrainingContext = () => {
        const currentData = slideContentData[currentSlide] || slideContentData[0];
        return currentData.summary;
    };

    const handleSendMessage = async (text = input) => {
        if (text.trim() === '') return;

        const userMessage = { text: text, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsThinking(true);

        const context = getTrainingContext();

        // --- Smarter Simulated Response Logic ---
        const simulatedResponse = getSimulatedAiResponse(text, context);

        setTimeout(() => {
            const aiMessage = { text: simulatedResponse, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
            setIsThinking(false);
        }, 1200); // Slightly longer delay for "thinking" feel
    };

    // Friendly & Smart Logic
    const getSimulatedAiResponse = (query, context) => {
        const q = query.toLowerCase();
        const currentData = slideContentData[currentSlide] || slideContentData[0]; // Fallback to slide 0 if undefined

        // 1. PRIORITY: Summarize
        if (q.includes('summary') || q.includes('summarize') || q.includes('takeaway') || q.includes('key point') || q.includes('slide')) {
            return `📝 **Summary:**\n\n${currentData.summary}`;
        }

        // 2. PRIORITY: Examples (Return a random one from the 5+ list)
        if (q.includes('example') || q.includes('real world') || q.includes('instance')) {
            const randomExample = currentData.examples[Math.floor(Math.random() * currentData.examples.length)];
            return `${randomExample}`;
        }

        // 3. PRIORITY: Importance (Return a random one from the 5+ list)
        if (q.includes('important') || q.includes('why') || q.includes('significance') || q.includes('benefit')) {
            const randomImportance = currentData.importance[Math.floor(Math.random() * currentData.importance.length)];
            return `${randomImportance}`;
        }

        // 4. Check Knowledge Base for matches
        for (const item of knowledgeBase) {
            if (item.keywords.some(keyword => q.includes(keyword))) {
                return item.answer;
            }
        }

        // 5. Greetings
        if (q.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|howdy|sup)\b/)) {
            return "Hi there! 👋 I'm your AI Training Assistant.\n\nI'm here to help you navigate the future of finance.\n\n**Ask me anything about the training, specific tools, or accounting scenarios!**";
        }

        // 6. Farewells
        if (q.match(/\b(bye|goodbye|see ya|later|cya)\b/)) {
            return "Goodbye! 👋\n\nGood luck with your training. I'll be here if you have more questions later!";
        }

        // 7. Specific Help / Confusion
        if (q.includes('help') || q.includes('confused') || q.includes('understand') || q.includes('lost')) {
            return "No worries! Accounting AI is a shift, but it's designed to help you. 🧠\n\nWe're moving from manual typing to **strategic thinking**.\n\nTry asking:\n• 'How does AI help with audits?'\n• 'What is a good prompt?'\n• 'Is my job safe?'";
        }

        // 8. Generic Fallback - Updated with Happy Emoji and slide context
        return `That's a great question! 😊\n\nRegarding **${slideTitle}**, here is the key concept:\n${context}\n\nIf you need a specific definition or example (like "What is OCR?"), just ask!`;
    };

    const quickQuestions = [
        "Summarize this slide 📝",
        "Give me a real-world example 💡",
        "Why is this important? 🚀"
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition z-50 flex items-center justify-center hover:scale-110 duration-200"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-fade-in-up">
                    <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <Sparkles size={20} className="text-yellow-300" />
                            <span className="font-bold text-sm">Training Companion</span>
                        </div>
                        <X onClick={() => setIsOpen(false)} className="w-5 h-5 cursor-pointer opacity-75 hover:opacity-100" />
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.length === 0 && (
                            <div className="text-center p-4 text-slate-500 text-xs space-y-4">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                    <Bot size={24} />
                                </div>
                                <p>👋 <strong>Hi there!</strong> I'm your AI Training Assistant.</p>
                                <p>I can help you master <strong>"{slideTitle}"</strong>. What would you like to know?</p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                                    msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-gray-100 rounded-bl-none'
                                }`}>
                                    {formatMessage(msg.text)}
                                </div>
                            </div>
                        ))}

                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4 pt-2 bg-slate-50 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {quickQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSendMessage(q)}
                                className="whitespace-nowrap px-3 py-1 bg-white border border-indigo-200 rounded-full text-xs text-indigo-600 hover:bg-indigo-50 transition"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isThinking && handleSendMessage()}
                            placeholder="Type your question..."
                            className="flex-grow p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isThinking}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            className={`p-2.5 rounded-xl text-white transition ${isThinking ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            disabled={isThinking}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define slide titles for the chatbot context
  const slideTitles = [
    "Intro",
    "Why AI Matters",
    "Core Modules",
    "Mindset Game",
    "Prompting Techniques",
    "Smarter Workflows",
    "Responsible AI",
    "Practical Apps",
    "Simulation Suite",
    "Resources",
    "Conclusion"
  ];
  const currentSlideTitle = slideTitles[currentSlide];

  // Utility component for slide transitions (Optimized for height)
  const SlideContainer = ({ children }) => (
    <div className="flex flex-col h-full animate-fade-in p-2">
      {children}
    </div>
  );

  // --- Slide 1: Intro (CLEAN, NO VIDEO) ---
  const IntroSlide = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6">

        {/* NEW ATTRACTIVE LOGO: Calculator + Sparkles (Automated Precision) */}
        <div className="p-4 bg-indigo-50 rounded-full shrink-0 relative border-2 border-indigo-100 shadow-sm">
          <div className="relative w-16 h-16 flex items-center justify-center">
              <Calculator className="w-16 h-16 text-indigo-600 opacity-20 absolute" />
              <Sparkles className="w-10 h-10 text-indigo-700 font-bold z-10" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 shrink-0">AI in Accounting: The Next Chapter</h1>
        <p className="text-xl text-slate-600 max-w-2xl shrink-0">
          Transforming tedious work into strategic insights and expertise.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mt-4 shrink-0">
          <p className="font-semibold text-slate-700 text-lg">"Automate the routine. Build the future."</p>
        </div>
        <button
          onClick={() => setCurrentSlide(1)}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl text-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center mt-8 shrink-0"
        >
          Start Training <ArrowRight className="ml-2 w-6 h-6" />
        </button>
      </div>
    );
  };

  // --- Slide 2: Why AI Matters ---
  const BenefitCard = ({ icon: Icon, title, desc, gradient, delay, className = '' }) => (
    <div
        // Card sizing relies on the parent grid for height uniformity (no aspect-square)
        className={`group relative p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col animate-fade-in-up overflow-hidden justify-between h-full ${className}`}
        style={{ animationDelay: delay }}
    >
      {/* Elegant top border reveal on hover */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Background decoration */}
      <div className={`absolute -right-8 -top-8 w-20 h-20 bg-gradient-to-br ${gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`} />

      <div className="flex items-start justify-between mb-1 relative z-10">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm text-white shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <ArrowRight className="text-slate-300 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
      </div>

      <div className="relative z-10">
        <h4 className="font-bold text-sm text-slate-800 mb-0.5 group-hover:text-slate-900 tracking-tight">{title}</h4>
        <p className="text-slate-500 text-[11px] leading-snug font-medium">{desc}</p>
      </div>
    </div>
  );

  const WhyAISlide = () => {
    /* To center the last two boxes (Trusted Advisor and Stay Compliant),
       we break the 5 cards into two rows.
       Row 1: 3 cards (takes full width)
       Row 2: 2 cards (needs centering)
       The overall grid will now be a two-row grid, forcing equal vertical sizing.
    */
    const allCards = [
        { icon: UserCheck, title: "Upgrade Role", desc: "Stop typing data manually and start reviewing AI outputs.", gradient: "from-amber-400 to-orange-500", delay: "0ms" },
        { icon: CheckCircle, title: "Close Faster", desc: "Close the books faster with less stress during month-end.", gradient: "from-emerald-400 to-teal-500", delay: "100ms" },
        { icon: Shield, title: "Catch Mistake", desc: "The best part is that these tools watch all the numbers, 24 hours a day. If the transaction looks strange or suspicious, we get an instant alert.", gradient: "from-rose-400 to-red-500", delay: "200ms" },
        { icon: Users, title: "Trusted Advisor", desc: "Think of AI as a highly efficient research assistant, someone we trust to do the fast, objective work. It's an advisor, not the decision-maker.", gradient: "from-blue-500 to-indigo-600", delay: "300ms" },
        { icon: BookOpen, title: "Stay Compliant", desc: "Stay ahead of changing GAAP rules and regulations automatically.", gradient: "from-violet-500 to-purple-600", delay: "400ms" },
    ];

    return (
      <SlideContainer>
        <div className="text-center mb-3 shrink-0">
          <div className="inline-block px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold tracking-widest text-indigo-600 uppercase mb-2">
              Strategic Value
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Why AI Matters in Accounting</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xs leading-relaxed">
            Shift your focus from <span className="text-slate-800 font-semibold">transactional processing</span> to <span className="text-indigo-600 font-bold">strategic analysis</span>.
          </p>
        </div>

        {/* Main Grid Container: Forces 2 equal vertical rows and 3 horizontal columns on large screens */}
        {/* FIX: Using flex container on lg screens around the grid to ensure centering for row 2 and uniform height */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-3 max-w-6xl mx-auto min-h-0 flex-grow">

          {/* Row 1: Cards 1, 2, 3 (Standard flow) */}
          {allCards.slice(0, 3).map((item, index) => (
            <BenefitCard key={index} {...item} />
          ))}

          {/* Row 2 Container (Custom centering for Cards 4 and 5) */}
          {/* We now use a nested flex container to center the final two cards exactly, filling the remaining space of the main grid's bottom row. */}
          <div className="lg:col-span-3 flex justify-center gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 max-w-2xl w-full">
              {allCards.slice(3, 5).map((item, index) => (
                <BenefitCard key={3 + index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </SlideContainer>
    );
  };

  // --- Slide 3: Core Modules for AI ---
  const ModuleOverview = () => {
    const modules = [
      { title: "New Mindset", desc: "AI as a Partner: Embrace Collaboration", icon: Bot, color: "text-purple-600 bg-purple-100" },
      { title: "Effective Prompting", desc: "Learn to ask clear questions for best answers.", icon: MessageSquare, color: "text-blue-600 bg-blue-100" },
      { title: "Smarter Workflows", desc: "Streamline work; automate the right places.", icon: Settings, color: "text-amber-600 bg-amber-100" },
      { title: "Responsible AI", desc: "Safety, security, and compliance.", icon: Lock, color: "text-green-600 bg-green-100" }
    ];

    return (
      <SlideContainer>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center shrink-0">Core Modules for AI</h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mx-auto flex-grow">
          {modules.map((m, i) => (
            <div key={i} className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-slate-100 hover:border-blue-300 transition h-full justify-center text-center">
              <div className={`p-3 rounded-full mb-3 ${m.color} shrink-0`}>
                <m.icon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{m.title}</h3>
                <p className="text-slate-600 text-sm">{m.desc}</p>
            </div>
            </div>
          ))}
        </div>
      </SlideContainer>
    );
  };

  // --- Slide 4: Mindset Game ---
  const GameSorter = () => {
    const initialItems = [
      { id: 1, text: "Entering invoice data from vendors", type: "ai", reason: "AI excels at OCR (Optical Character Recognition) and extracting structured data from images instantly." },
      { id: 2, text: "Client Empathy & Strategy", type: "human", reason: "Understanding client emotions and crafting complex, long-term strategies requires human emotional intelligence." },
      { id: 3, text: "Drafting Routine Month-End Journal Entries", type: "ai", reason: "AI creates the draft based on patterns, but a human must always review and approve before posting." },
      { id: 4, text: "Interpreting Gray Areas of Tax", type: "human", reason: "Interpreting ambiguity in laws requires professional judgment and risk assessment that AI cannot provide reliably." },
      { id: 5, text: "Validating AI Financial Reports", type: "human", reason: "You are the expert. AI gathers information, but only you have the judgment to validate its accuracy and context." },
      { id: 6, text: "Drafting Standard Emails", type: "ai", reason: "Generative AI is perfect for drafting routine communications. It converts simple bullet points into professional text instantly, allowing you to edit rather than write from scratch." },
      { id: 7, text: "Matching Payments to Customer Invoices", type: "ai", reason: "Matching payments to invoices is a high-volume pattern matching task. AI does this instantly, freeing you to handle only the exceptions." }
    ];

    const [items, setItems] = useState(initialItems);
    const [gameState, setGameState] = useState('playing');
    const [feedback, setFeedback] = useState("");
    const [explanation, setExplanation] = useState("");
    const [feedbackType, setFeedbackType] = useState(""); // 'success' or 'error'
    const [isPaused, setIsPaused] = useState(false); // To pause and show explanation

    const handleSort = (item, choice) => {
      if (isPaused) return;

      if (item.type === choice) {
        setFeedback("Correct! ✅");
        setFeedbackType("success");
        setExplanation(item.reason);
        setIsPaused(true);
      } else {
        setFeedback("Try again! ❌");
        setFeedbackType("error");
        setExplanation("Hint: Consider if this task requires emotional intelligence (Human) or high-speed data processing (AI).");
      }
    };

    const handleNextItem = () => {
        if (items.length > 0) {
            const currentId = items[0].id;
            const nextItems = items.filter(i => i.id !== currentId);
            setItems(nextItems);
            setFeedback("");
            setExplanation("");
            setIsPaused(false);
            if (nextItems.length === 0) setGameState('won');
        }
    };

    if (gameState === 'won') return (
      // Optimized layout: Removed the 4 summary cards to reduce "too much content" feeling.
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-6 animate-fade-in h-full">

        <div className="flex flex-col items-center mb-8 text-center shrink-0">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4 shadow-sm rounded-full bg-green-50 p-1" />
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Mindset Established!</h2>
            <p className="text-slate-600 text-lg max-w-md">
                AI makes us better professionals by handling the volume while we handle the value.
            </p>
        </div>

        {/* Module 4 Key Summary Points */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mb-6">
            <div className="p-3 rounded-lg border border-purple-200 text-left bg-purple-50">
                <h4 className="font-bold text-purple-800 text-sm mb-1">1. Better Professionals</h4>
                <p className="text-xs text-slate-700 leading-relaxed">AI handles boring data entry, freeing us for interesting analysis and planning.</p>
            </div>
            <div className="p-3 rounded-lg border border-purple-200 text-left bg-purple-50">
                <h4 className="font-bold text-purple-800 text-sm mb-1">2. Best Use Cases</h4>
                <p className="text-xs text-slate-700 leading-relaxed">Start by automating the tasks you hate. This solves immediate slowdowns.</p>
            </div>
            <div className="p-3 rounded-lg border border-purple-200 text-left bg-purple-50">
                <h4 className="font-bold text-purple-800 text-sm mb-1">3. Practical Examples</h4>
                <p className="text-xs text-slate-700 leading-relaxed">AI handles complex Excel setups instantly, so we can skip to checking final results.</p>
            </div>
            <div className="p-3 rounded-lg border border-purple-200 text-left bg-purple-50">
                <h4 className="font-bold text-purple-800 text-sm mb-1">4. You are the Expert</h4>
                <p className="text-xs text-slate-700 leading-relaxed">AI gathers info, but you provide judgment. Your expertise turns data into business advice.</p>
            </div>
        </div>

        <button onClick={() => setCurrentSlide(currentSlide + 1)} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shrink-0 flex items-center text-lg">
            Next Module <ArrowRight className="w-5 h-5 ml-2"/>
        </button>
      </div>
    );

    const currentItem = items[0];

    return (
      <SlideContainer>
        <div className="flex flex-col h-full max-w-4xl mx-auto overflow-y-auto items-center justify-center">
          <h2 className="text-2xl font-bold mb-2 shrink-0 text-center">Developing an AI Mindset</h2>
          <p className="text-slate-500 mb-6 text-center text-sm">Yours or the AI's?</p>

          <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-slate-100 mb-6 w-full max-w-2xl text-center flex items-center justify-center min-h-[100px]">
            <h3 className="text-xl font-bold text-slate-800">{currentItem.text}</h3>
          </div>

          <div className="flex gap-4 justify-center mb-4 w-full max-w-2xl">
            <button
              onClick={() => handleSort(currentItem, 'ai')}
              disabled={isPaused}
              className={`flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex flex-col items-center gap-2 transition shadow-md text-sm ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Bot className="w-6 h-6" />
              AI / Automation
            </button>
            <button
              onClick={() => handleSort(currentItem, 'human')}
              disabled={isPaused}
              className={`flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex flex-col items-center gap-2 transition shadow-md text-sm ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Users className="w-6 h-6" />
              Human / Strategy
            </button>
          </div>

          {/* Feedback Area with Next Button */}
          <div className={`w-full max-w-2xl text-center p-3 rounded-lg min-h-[100px] flex flex-col justify-center items-center transition-opacity duration-300 ${feedback ? (feedbackType === 'success' ? 'bg-green-100 text-green-800 opacity-100' : 'bg-red-100 text-red-800 opacity-100') : 'opacity-0'}`}>
             {feedback && (
                 <>
                    <p className="font-bold text-sm mb-1">{feedback}</p>
                    <p className="text-xs italic mb-2">{explanation}</p>
                    {isPaused && feedbackType === 'success' && (
                        <button
                            onClick={handleNextItem}
                            className="px-4 py-1 bg-slate-800 text-white rounded-full text-xs hover:bg-slate-900 transition"
                        >
                            Next Task →
                        </button>
                    )}
                 </>
             )}
          </div>
        </div>
      </SlideContainer>
    );
  };

  // --- Slide 5: Prompt Engineering ---
  const PromptLab = () => {
    const [step, setStep] = useState(0);

    const steps = [
      {
        rule: "Rule 1: Be Specific",
        bad: "Write a report.",
        good: "Write a quarterly expense report focusing on travel for Q3.",
        tip: "AI only knows what you tell it. Vague prompts lead to vague results."
      },
      {
        rule: "Rule 2: Give It a Role",
        bad: "Look at this data.",
        good: "Act as a Revenue Accountant. Review the Q1 sales data for revenue recognition risks.",
        tip: "Tell the AI to act like a Specialist or Analyst for better quality output."
      },
      {
        rule: "Rule 3: Set the Goal",
        bad: "What is this?",
        good: "Summarize this forecast for the CFO in 3 bullet points.",
        tip: "Tell it exactly what you need: forecast, summary, report, analysis, etc."
      },
      {
        rule: "Rule 4: Choose the Format",
        bad: "Tell me the variance.",
        good: "Create a simple table comparing Q2 vs Q3 with % change.",
        tip: "Ask for a list, a table, a markdown document, or a simple explanation."
      },
      {
        rule: "Final: Putting It All Together",
        bad: "Tell me why revenue is down.",
        good: "Act as a Revenue Manager. Analyze the Q3 Regional Sales Performance report. Identify the top 3 regions that missed their revenue targets. Summarize the findings in a table with columns for 'Region', 'Variance Amount', and 'Primary Cause'.",
        tip: "Notice how the 'Good' prompt combines all 4 rules: Role, Specificity, Goal, and Format."
      }
    ];

    return (
      <SlideContainer>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center shrink-0">Effective Prompting Techniques</h2>
        <p className="text-slate-600 mb-4 text-center text-sm shrink-0">Prompting with Purpose: Simply Asking for Help</p>

        <div className="flex-grow flex items-center justify-center p-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4 shrink-0">
               <h3 className="text-xl font-bold text-blue-600">{steps[step].rule}</h3>
               <span className="text-xs text-slate-400">Rule {step + 1} of {steps.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg min-h-[80px] flex flex-col justify-center">
                <span className="text-red-600 font-bold block mb-1 text-xs uppercase tracking-wide">❌ Bad Request</span>
                <p className="text-base text-slate-800 italic">"{steps[step].bad}"</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg ring-2 ring-green-400 shadow-sm min-h-[80px] flex flex-col justify-center">
                <span className="text-green-700 font-bold block mb-1 text-xs uppercase tracking-wide">✅ Good Request</span>
                <p className="text-base text-slate-900 italic">"{steps[step].good}"</p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-6 shrink-0">
               <p className="text-blue-800 font-medium text-sm">💡 {steps[step].tip}</p>
            </div>

            <div className="flex justify-between shrink-0">
              <button
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                className={`px-3 py-1.5 rounded text-sm font-medium ${step === 0 ? 'text-gray-300' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Previous
              </button>
              <button
                onClick={() => step < steps.length - 1 ? setStep(step + 1) : setCurrentSlide(currentSlide + 1)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md text-sm"
              >
                {step < steps.length - 1 ? "Next Rule" : "Finish Lab"}
              </button>
            </div>
          </div>
        </div>
      </SlideContainer>
    );
  };

  // --- Slide 6: Workflow Optimization ---
  const WorkflowSlide = () => {
    const [activeStep, setActiveStep] = useState(null);

    const steps = [
      { id: 1, title: "Find Slow Spots", text: "Identify the most tedious and repetitive tasks we do every month.", icon: Search, summary: "Identify the most tedious and repetitive tasks we do every month." },
      { id: 2, title: "Clean Up Steps", text: "Simplify the Process by using AI before putting automation into it.", icon: CheckSquare, summary: "Simplify the Process by using AI before putting automation into it." },
      { id: 3, title: "Place Automation", text: "Put the AI tool only where it saves the most time.", icon: Cpu },
      { id: 4, title: "Ready For Review", text: "Ensure data moves smoothly from machine to human.", icon: Users, summary: "Ensure the data moves smoothly from the machine to the human." },
    ];

    return (
      <SlideContainer>
           <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center shrink-0">Smarter Workflows</h2>
           <p className="text-slate-600 text-center mb-6 max-w-2xl mx-auto text-sm shrink-0">Streamlining our work by putting automation in the right places.</p>

           <div className="h-40 mb-4 flex items-center justify-center shrink-0">
               {/* This placeholder div is kept to maintain layout consistency with the request, though visually it's an empty spacer unless an image is desired */}
           </div>

           {/* The Four Cards Row */}
           <div className="flex gap-2 justify-center items-start flex-grow w-full max-w-5xl mx-auto">
             {steps.map((step) => (
               <div
                 key={step.id}
                 onMouseEnter={() => setActiveStep(step.id)}
                 onMouseLeave={() => setActiveStep(null)} // Reset on leave to hide detail view
                 className={`flex-1 p-3 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-start text-center relative group
                   ${activeStep === step.id ? 'bg-blue-50 border-blue-500 shadow-lg z-10 scale-105' : 'bg-white border-slate-200 hover:border-blue-300'}
                 `}
               >
                 <div className={`p-2 rounded-full mb-2 ${activeStep === step.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'} shrink-0`}>
                    <step.icon size={18} />
                 </div>
                 <h4 className="font-bold text-sm text-slate-800 mb-1">{step.title}</h4>
               </div>
             ))}
           </div>

           {/* Dynamic Detail Area */}
           <div className="mt-4 min-h-[160px] w-full max-w-3xl mx-auto transition-all duration-300">
               {activeStep === 3 ? (
                   // Special Detailed View for Step 3 "Place Automation"
                   <div className="bg-white rounded-xl border border-indigo-200 shadow-md p-4 grid md:grid-cols-2 gap-6 animate-fade-in h-full items-center">
                       <div className="space-y-2">
                           <div className="flex items-center gap-2 text-indigo-700 mb-1">
                               <Users size={18} />
                               <h4 className="font-bold text-sm">1. AI as an Assistant</h4>
                           </div>
                           <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                               <li><strong>Best for:</strong> Emails, drafting documents, quick analysis.</li>
                               <li><strong>The Workflow:</strong> Human Input → AI Processing → Human Review → Action</li>
                           </ul>
                       </div>
                       <div className="space-y-2">
                           <div className="flex items-center gap-2 text-purple-700 mb-1">
                               <Settings size={18} />
                               <h4 className="font-bold text-sm">2. AI as an Engine</h4>
                           </div>
                           <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                               <li><strong>Best for:</strong> Data entry, sorting invoices, recurring tasks.</li>
                               <li><strong>The Workflow:</strong> Data Trigger → AI Processing → System Action → Human Final Approval</li>
                           </ul>
                       </div>
                   </div>
               ) : activeStep ? (
                   // Standard View for Steps 1, 2, 4
                   <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-md text-center h-full flex flex-col justify-center items-center animate-fade-in">
                       <h4 className="font-bold text-lg text-blue-800 mb-2">{steps[activeStep-1].title}</h4>
                       <p className="text-slate-600 text-sm">{steps[activeStep-1].summary || steps[activeStep-1].text}</p>
                   </div>
               ) : (
                   // Default Empty State
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center h-full flex flex-col justify-center items-center">
                       <p className="text-slate-500 italic text-xs">💡 Hover over any step above to see details.</p>
                   </div>
               )}
           </div>
      </SlideContainer>
    );
  };

  // --- Slide 7: Responsible AI ---
  // PolicyCard component for responsible AI section - Lighter design
  const PolicyCard = ({ icon: Icon, title, subTitle, concept, standard, color }) => (
    <div className={`p-4 rounded-xl border border-transparent transition-all duration-300 cursor-default flex flex-col justify-start ${color.bg_hover} hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-offset-1 ${color.ring_hover}`}>
        <div className={`flex items-center mb-2 shrink-0 border-l-4 ${color.border_left} pl-2`}>
            <Icon className={`mr-2 w-5 h-5 ${color.text}`} />
            <h3 className="font-bold text-base text-slate-800">{title}</h3>
            <span className={`text-xs ml-2 font-medium ${color.text} opacity-80`}>{subTitle}</span>
        </div>
        {/* Removing inner boxes to reduce bulkiness, using simple text */}
        <div className="space-y-2 text-xs pl-2 pt-1 flex-grow">
            <div>
                <span className={`font-bold ${color.text} text-[10px] uppercase tracking-wider mr-1`}>Concept:</span>
                <span className="text-slate-700 leading-snug">{concept}</span>
            </div>
            <div>
                <span className={`font-bold ${color.text} text-[10px] uppercase tracking-wider mr-1`}>Standard:</span>
                <span className="text-slate-700 leading-snug">{standard}</span>
            </div>
        </div>
    </div>
  );

  const ResponsibleAISlide = () => {
    const policyColors = {
        green: { text: "text-green-600", border_left: "border-green-500", ring_hover: "hover:ring-green-500", bg_hover: "hover:bg-green-50/70" },
        red: { text: "text-red-600", border_left: "border-red-500", ring_hover: "hover:ring-red-500", bg_hover: "hover:bg-red-100/70" },
        blue: { text: "text-blue-600", border_left: "border-blue-500", ring_hover: "hover:ring-blue-500", bg_hover: "hover:bg-blue-100/70" },
        purple: { text: "text-purple-600", border_left: "border-purple-500", ring_hover: "hover:ring-purple-500", bg_hover: "hover:bg-purple-100/70" },
    };

    const policies = [
        { title: "Human Verification", subTitle: "(The Review)", concept: "AI creates the draft; we create the approval.", standard: "We treat AI as a data provider, not a decision maker. The human maintains final sign-off authority.", color: policyColors.green },
        { title: "Data Confidentiality", subTitle: "(The Privacy)", concept: "Public AI tools store and learn from whatever you type. Customer trust is our most important asset.", standard: "Never put sensitive company or customer information into public AI tools.", color: policyColors.red },
        { title: "Regulatory Compliance", subTitle: "(The Law)", concept: "We can be fast, but we must be legal.", standard: "All AI work must follow company policy, tax laws, and regulations (like SOX).", color: policyColors.blue },
        { title: "Audit Trails", subTitle: "(The Proof)", concept: "If we can't prove it, it didn't happen.", standard: "We track exactly when and how we use AI. We keep clear records for future audits.", color: policyColors.purple },
    ];

    return (
      <SlideContainer>
           <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center shrink-0">Responsible AI Usage</h2>

           {/* Policy Cards Grid - Updated spacing and padding */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-6xl mx-auto w-full flex-grow min-h-0">
             {policies.map((p, i) => (
                 <PolicyCard key={i} icon={p.title === 'Human Verification' ? CheckCircle : p.title === 'Data Confidentiality' ? Lock : p.title === 'Regulatory Compliance' ? BookOpen : Search} {...p} />
             ))}
           </div>

           {/* Bias Watch Section (Expanded size) */}
           <div className="mt-3 bg-amber-50 p-4 rounded-xl border border-amber-200 w-full max-w-6xl mx-auto shrink-0 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 mb-2">
              <h3 className="font-bold text-sm text-amber-800 mb-2 flex items-center justify-center uppercase tracking-wide border-b border-amber-200 pb-2">
                  <AlertTriangle className="w-5 h-5 mr-2"/> Be Aware: Common AI Problems
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-amber-900 leading-snug">
                  <div>
                      <strong className="block mb-1 text-amber-950 font-bold text-sm">Common Issues</strong>
                      <ul className="list-disc list-inside ml-1 space-y-1">
                          <li>AI often agrees ("yes") even if other answers are possible.</li>
                          <li>It may forget diverse viewpoints.</li>
                          <li>It tends to repeat common ideas instead of generating new ones.</li>
                      </ul>
                  </div>
                  <div>
                      <strong className="block mb-1 text-amber-950 font-bold text-sm">How to Reduce Bias</strong>
                      <ul className="list-disc list-inside ml-1 space-y-1">
                          <li>Ask AI for multiple perspectives or "pros and cons".</li>
                          <li>Use simple, clear neutral language in prompts.</li>
                          <li>Explicitly ask for answers that include diverse groups.</li>
                      </ul>
                  </div>
              </div>
           </div>
      </SlideContainer>
    );
  };

  // --- Slide 8: Practical Applications ---
  const PracticalAppsSlide = () => {
    // Top 5 general tools (for non-sensitive content)
    const generalTools = [
      { name: "Email", desc: "Drafting professional emails faster", icon: Mail },
      { name: "Excel", desc: "Generating and analyzing complex formulas", icon: FileSpreadsheet },
      { name: "Word", desc: "Summarizing complex documents", icon: FileText },
      { name: "SAP", desc: "Helping with SAP information retrieval", icon: Database },
      { name: "Flowcharts", desc: "Creating flowcharts", icon: Zap },
    ];

    return (
       <SlideContainer>
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center shrink-0">Hands-On: Practical Applications</h2>

          {/* Main CTA Block */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center mb-3 shrink-0">
              <button onClick={() => setCurrentSlide(currentSlide + 1)} className="flex flex-col items-center justify-center w-full hover:scale-[1.01] transition">
                  <h4 className="font-bold text-lg text-blue-900 mb-1">Start Here: Begin Advanced Simulation</h4>
                  <p className="text-blue-700 text-sm mb-2">Test your AR, AP, GL & Audit skills first!</p>
                  <div className="flex items-center justify-center font-bold text-white bg-blue-600 px-4 py-2 rounded-full text-sm shadow-md">Start Challenges <ArrowRight size={16} className="ml-2" /></div>
              </button>
          </div>

          {/* Tool List Details (Moved under CTA) */}
          <div className="text-center text-slate-500 text-[10px] sm:text-xs shrink-0 mb-3">
              <p className="font-bold mb-1 uppercase tracking-wider text-slate-700">Approved AI tools for Practice and Research for Non Sensitive Content:</p>
              <p className="mb-0.5">
                  Microsoft Copilot (free M365 version in Excel, Outlook, Teams, Word), ChatGPT, Google Gemini, Anthropic Claude, Azure OpenAI.
              </p>
              <p>
                  Google Vertex AI, Amazon Bedrock, Notion AI, Jasper, Perplexity, and Grok AI.
              </p>
          </div>

          {/* Tools Grid Container */}
          <div className="flex flex-col gap-3 w-full max-w-6xl mx-auto flex-grow p-1">

              {/* Row 1: General Productivity Tools (5 boxes in one line, equal size) */}
              <div className="grid grid-cols-5 gap-3 w-full shrink-0">
                  {generalTools.map((tool, i) => (
                      <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center transition group hover:bg-blue-50 shadow-sm hover:shadow-md h-full">
                          <div className="bg-blue-100 w-9 h-9 rounded-lg flex items-center justify-center mb-1 group-hover:bg-blue-200 shrink-0">
                              <tool.icon className="text-blue-600 w-5 h-5" />
                          </div>
                          <h4 className="font-bold text-sm text-slate-800 mb-0.5 text-center leading-tight">{tool.name}</h4>
                          <p className="text-slate-600 text-[11px] text-center leading-snug">{tool.desc}</p>
                      </div>
                  ))}
              </div>

              {/* Row 2: Numero (Enlarged, Rectangular, and Centered underneath) */}
              <div className="flex justify-center w-full shrink-0 mt-3">
                  <a
                    href="https://numero.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-white border-2 border-green-400 rounded-xl flex flex-col items-center justify-center transition group hover:bg-green-50 shadow-lg hover:shadow-xl hover:scale-[1.02] w-[200px] h-auto mx-auto"
                  >
                      <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-1.5 group-hover:bg-green-200 shrink-0">
                           <DollarSign className="text-green-600 w-5 h-5" />
                      </div>
                      <h4 className="font-extrabold text-sm text-green-700 mb-0.5 text-center leading-tight">Numero</h4>
                      <p className="text-green-800 text-[10px] text-center mb-1">FOR COMPANY USE</p>
                      <p className="text-slate-600 text-[10px] text-center leading-snug">Automating Finance Insight</p>
                  </a>
              </div>
          </div>
       </SlideContainer>
    );
  };

  // --- Slide 9: Advanced Simulation Suite (NEW) ---
  const AdvancedAuditChallenge = () => {
    const [activeTab, setActiveTab] = useState('ar');
    const [aiResponse, setAiResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    // Scenario Data - UPDATED TO 2025 & DATES
    const scenarios = {
      ar: {
        title: "AR: Credit Request & Past Due",
        data: [
            { inv: "INV-2001", date: "2025-01-20", amount: "$12,500", days: "45", status: "PAST DUE" },
            { inv: "INV-2045", date: "2025-03-25", amount: "$18,000", days: "10", status: "Current" },
            { inv: "INV-2102", date: "2025-04-01", amount: "$15,000", days: "5", status: "Current" },
        ],
        task: "Sales is asking for a credit bump. Reply nicely but firmly about the 45-day overdue invoices.",
        aiPrompt: "Draft a polite, friendly email to sales about the 45-day overdue balance before approving credit.",
        aiResult: "Subject: Re: Credit Limit Increase - TechStar Inc\n\nHi Sales Team,\n\nI'd be happy to help review the credit limit increase for TechStar to support their growth.\n\nHowever, I noticed they have invoices outstanding for 45 days (INV-2001). To protect our cash flow and get this approved quickly, could you give them a nudge on payment?\n\nOnce that's cleared, we can proceed with the limit increase immediately!\n\nThanks,\nAccounting"
      },
      ap: {
        title: "AP: Invoices Sent to Wrong Email",
        data: [
            { vendor: "OfficeMax", inv: "9901", amount: "$450", sent_to: "bob@company.com", status: "LOST" },
            { vendor: "Delta", inv: "TRV-22", amount: "$1,200", sent_to: "ap@company.com", status: "Processed" },
            { vendor: "TechCorp", inv: "SVS-99", amount: "$2,500", sent_to: "susan@company.com", status: "LOST" },
        ],
        task: "Vendors are angry because invoices sent to personal emails aren't getting paid. Use AI to draft a process enforcement email.",
        aiPrompt: "Draft a reply to angry vendors explaining they must use the central AP email for guaranteed processing.",
        aiResult: "Subject: Important: Update on Invoice Processing\n\nDear Vendor,\n\nI apologize for the delay in payment. It appears these invoices were sent to individual personal inboxes, which caused them to be missed by our system.\n\nTo ensure you get paid on time moving forward, please send all future invoices to: invoices@company.com.\n\nI have manually retrieved your attached invoice and expedited it for immediate payment today.\n\nBest,\nAccounts Payable"
      },
      gl: {
        title: "GL: Profit Center Mismatch",
        data: [
            { je: "JE-101", account: "Marketing Ads", pc: "IT-Dept", amount: "$5,000", month: "Mar 2025" },
            { je: "JE-102", account: "Server Hosting", pc: "IT-Dept", amount: "$12,000", month: "Mar 2025" },
            { je: "JE-103", account: "R&D Supplies", pc: "Sales", amount: "$2,500", month: "Mar 2025" },
        ],
        task: "Transactions are booking to the wrong profit centers (e.g., Marketing cost in IT). Use AI to scan the entries for logical mismatches.",
        aiPrompt: "Scan journal entries for mismatched Account vs Profit Center logic.",
        aiResult: "ANOMALY DETECTED:\n\n1. JE-101: 'Marketing Ads' is booked to 'IT-Dept'. \n    -> Suggestion: Reclass to 'Marketing-Dept'.\n\n2. JE-103: 'R&D Supplies' is booked to 'Sales'.\n    -> Suggestion: Reclass to 'R&D-Dept'."
      },
      audit: {
        title: "Audit: Segregation of Duties",
        data: [
            { id: "REQ-001", requester: "J. Smith", approver: "S. Johnson", amount: "$5,000", date: "Mar 2025" },
            { id: "REQ-002", requester: "M. Doe", approver: "S. Johnson", amount: "$2,500", date: "Mar 2025" },
            { id: "REQ-003", requester: "A. Williams", approver: "A. Williams", amount: "$9,500", date: "Mar 2025" },
        ],
        task: "Ensure that the person requesting a payment is NOT the same person approving it. Identify the SOX violation.",
        aiPrompt: "Run SOX Control Test: SoD Check for same Requester and Approver.",
        aiResult: "CRITICAL FLAG: REQ-003\nViolation: Requester (A. Williams) matches Approver (A. Williams).\nRisk: High fraud risk. \nAction: This violates the 'Segregation of Duties' control. Flag for immediate audit review."
      }
    };

    const scenario = scenarios[activeTab];

    const handleAction = (actionType) => {
        if (actionType === 'solve') {
            setLoading(true);
            setAiResponse(null); // Clear previous response
            setTimeout(() => {
                setLoading(false);
                setAiResponse(scenario.aiResult);
            }, 1500);
        }
    };

    return (
      <SlideContainer>
           {/* Modern UI Design Changes Applied Here */}
           <div className="flex justify-between items-end mb-3 shrink-0 border-b pb-2">
             <div>
                 <h2 className="text-2xl font-extrabold text-indigo-700">Advanced Simulation Suite</h2>
                 <p className="text-gray-500 text-sm">Test your analytical and communication skills.</p>
             </div>
           </div>

           {/* Tabs */}
           <div className="flex gap-2 mb-3 border-b border-gray-300 shrink-0">
             {Object.keys(scenarios).map(key => (
                 <button
                     key={key}
                     onClick={() => { setActiveTab(key); setAiResponse(null); }}
                     className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === key ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                 >
                     {key.toUpperCase()}
                 </button>
             ))}
           </div>

           {/* Main Challenge Area */}
           <div className="flex-grow flex flex-col lg:flex-row gap-4 overflow-hidden p-1">

             {/* Left: Context & Data */}
             <div className="lg:w-1/2 flex flex-col overflow-hidden">
                 <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-md mb-2 shrink-0">
                     <h3 className="font-bold text-sm text-gray-800 mb-1">{scenario.title}</h3>
                     <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 mt-2">
                         <p className="text-yellow-800 font-bold text-xs uppercase">Your Task</p>
                         <p className="text-yellow-900 text-sm">{scenario.task}</p>
                     </div>
                 </div>

                 {/* Data View with Image Placeholder - Optimized for vertical fit */}
                 <div className="bg-gray-900 rounded-xl overflow-hidden flex-grow shadow-2xl flex flex-col min-h-[150px] lg:min-h-0">
                     <div className="bg-gray-800 p-2 flex items-center gap-2 border-b border-gray-700 shrink-0">
                         <Terminal size={14} className="text-green-400" />
                         <span className="text-gray-400 font-mono text-xs">System_Data_View (Mar 2025 Data)</span>
                     </div>

                     <div className="p-3 overflow-y-auto flex-grow">
                         {/* Virtual Screenshot Placeholder with descriptive image URL - FIXED FONT SIZE */}
                         <img
                             src={`https://placehold.co/600x100/1f2937/d1d5db?font=Inter&font-size=10&text=${scenario.title.replace(/ /g, '+').replace(/:/g, '')}+DATA`}
                             alt={`Virtual screenshot of ${scenario.title} data.`}
                             className="w-full rounded-lg mb-2 border border-gray-700"
                         />

                         <table className="w-full text-left text-[10px] font-mono">
                             <thead>
                                 <tr className="text-gray-500 border-b border-gray-700">
                                     {Object.keys(scenario.data[0]).map((k) => (
                                         <th key={k} className="p-1 capitalize font-semibold">{k.replace('_', ' ')}</th>
                                     ))}
                                 </tr>
                             </thead>
                             <tbody className="text-gray-300">
                                 {scenario.data.map((row, idx) => (
                                     <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition">
                                         {Object.values(row).map((val, vIdx) => (
                                             <td key={vIdx} className="p-1">{val}</td>
                                         ))}
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </div>
             </div>

             {/* Right: AI Assistant (Modernized Chat Interface) */}
             <div className="lg:w-1/2 flex flex-col h-full min-h-[250px] lg:min-h-0">
                 <div className="bg-white border border-gray-200 rounded-xl h-full flex flex-col shadow-lg">
                     <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl shrink-0">
                         <div className="flex items-center gap-2">
                             <Zap className="text-purple-600" size={18} />
                             <span className="font-bold text-sm text-gray-800">AI Assistant</span>
                         </div>
                     </div>

                     <div className="flex-grow p-4 overflow-y-auto space-y-4">
                         {loading ? (
                             <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                                 <Cpu className="animate-spin text-purple-500" size={24} />
                                 <p className="text-xs">Analyzing data and drafting response...</p>
                             </div>
                         ) : aiResponse ? (
                             <div className="space-y-3">
                                 {/* User Prompt Bubble */}
                                 <div className="flex justify-end">
                                     <div className="bg-indigo-600 text-white p-3 rounded-l-xl rounded-tr-xl text-xs max-w-[90%] shadow-md">
                                         {scenario.aiPrompt}
                                     </div>
                                 </div>
                                 {/* AI Response Bubble */}
                                 <div className="flex justify-start">
                                     <div className="bg-gray-100 border border-purple-200 text-gray-800 p-3 rounded-r-xl rounded-tl-xl text-xs shadow-lg max-w-[95%]">
                                         <div className="flex items-center gap-1 mb-2 text-purple-600 font-bold text-[10px] uppercase tracking-wider">
                                             <Brain size={10} /> AI Analysis Result
                                         </div>
                                         <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-xs">{aiResponse}</pre>
                                     </div>
                                 </div>
                             </div>
                         ) : (
                             <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center p-4">
                                 <MessageSquare size={32} className="mb-3 opacity-20" />
                                 <p className="text-sm">This AI simulates the power of Copilot.<br/> Click below to see how fast it solves this challenge!</p>
                             </div>
                         )}
                     </div>

                     <div className="p-3 bg-gray-100 border-t border-gray-200 rounded-b-xl shrink-0">
                         <button
                             onClick={() => handleAction('solve')}
                             disabled={loading || aiResponse}
                             className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg text-sm"
                         >
                             {aiResponse ? <><CheckCircle size={16} /> Analysis Completed</> : <><Zap size={16} /> Run AI Analysis</>}
                         </button>
                     </div>
                 </div>
             </div>
           </div>
      </SlideContainer>
    );
  };

  // --- Slide 10: Resources (Fixed links) ---
  const ResourcesSlide = () => {
    const resources = [
      { title: "Viva Learning Portal", desc: "Internal training modules and videos on AI and M365.", icon: BookOpen, url: "https://learning.cloud.microsoft/home/providers" },
      { title: "Prompting Excellence Guide", desc: "Guide on engineering better inputs for AI Copilot.", icon: MessageSquare, url: "https://learning.cloud.microsoft/iframe-player/https%3A%2F%2Fsupport.microsoft.com%2Fen-us%2Farticle%2Fd565cb32-d137-41af-be28-c57f4d4762aa/MS_365_TRAINING/What%20makes%20a%20good%20prompt/d565cb32-d137-41af-be28-c57f4d4762aa/null/null/a581c8c0-e3cc-4fa8-bd52-238932d6fea2/en_us/Article" },
      { title: "Microsoft Copilot - Save Time", desc: "Official tips and tricks to save time with M365 tools.", icon: Zap, url: "https://learning.cloud.microsoft/detail/08c4c640-d7cd-4b3d-9565-a63435d96122" },
    ];

    return (
      <SlideContainer>
           <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center shrink-0">Learning Resources</h2>
           <div className="flex flex-col gap-3 max-w-3xl mx-auto w-full flex-grow overflow-y-auto p-1">
             {resources.map((resource, index) => (
               <a
                 key={index}
                 href={resource.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="p-4 bg-white border border-gray-200 rounded-xl flex items-center transition group hover:bg-indigo-50 shadow-md"
               >
                  <resource.icon className="text-indigo-600 mr-3 group-hover:text-indigo-700 w-6 h-6 shrink-0" />
                  <div className='flex-grow'>
                      <h3 className="font-bold text-base text-gray-800 group-hover:text-indigo-800">{resource.title}</h3>
                      <p className="text-gray-600 text-sm">{resource.desc}</p>
                  </div>
                  <div className="ml-auto text-sm font-medium text-indigo-500 shrink-0 flex items-center">
                      Open Link <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
               </a>
             ))}
           </div>
      </SlideContainer>
    );
  };

  // --- Slide 11: Conclusion ---
  const Conclusion = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-2">
      <div className="mb-4 p-3 bg-green-100 rounded-full shrink-0">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-4 shrink-0">Training Complete</h2>
      <div className="grid grid-cols-2 gap-4 text-left w-full max-w-4xl mt-4 flex-grow overflow-y-auto p-1">

        <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-md h-full">
            <h4 className="font-bold text-lg text-slate-800 mb-1">Time Saved is Value Gained</h4>
            <p className="text-slate-600 text-sm">Use that time for strategic analysis and planning.</p>
        </div>
        <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-md h-full">
            <h4 className="font-bold text-lg text-slate-800 mb-1">Our Standards Never Change</h4>
            <p className="text-slate-600 text-sm">Accuracy and integrity remain our core values.</p>
        </div>
        <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-md h-full">
            <h4 className="font-bold text-lg text-slate-800 mb-1">Our Role</h4>
            <p className="text-slate-600 text-sm">Drive our department forward with innovation and leadership.</p>
        </div>

        {/* Action Plan CTA - Highlighted */}
        <a
          href="https://copilot.microsoft.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 border-2 border-blue-500 rounded-xl bg-blue-50/70 shadow-lg h-full transition hover:shadow-xl hover:scale-[1.02] cursor-pointer block"
        >
            <h4 className="font-extrabold text-xl text-blue-700 mb-1 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-600" /> Action Plan
            </h4>
            <p className="text-slate-700 text-sm mb-1">Start Exploring. Try one new AI tool today for practice or research.</p>
            <span className="font-bold text-blue-600 text-sm flex items-center justify-center">
                Go to Microsoft Copilot <ArrowRight className="w-4 h-4 ml-1" />
            </span>
        </a>
      </div>
      <button
        onClick={() => setCurrentSlide(0)}
        className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-xl text-md font-bold hover:bg-slate-700 transition shadow-md shrink-0"
      >
        Restart Training
      </button>
    </div>
  );

  const slides = [
    <IntroSlide />,
    <WhyAISlide />,
    <ModuleOverview />,
    <GameSorter />,
    <PromptLab />,
    <WorkflowSlide />,
    <ResponsibleAISlide />,
    <PracticalAppsSlide />,
    <AdvancedAuditChallenge />,
    <ResourcesSlide />,
    <Conclusion />
  ];

  return (
    <div className="w-full h-screen bg-slate-50 flex items-center justify-center p-2 font-sans text-slate-900">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-full border border-slate-100">

        {/* Header */}
        <div className="bg-slate-800 text-white p-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="text-blue-400 w-6 h-6" />
            <span className="font-bold tracking-wider text-sm">AI ACCOUNTING <span className="text-blue-400">PRO</span></span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span>Module {currentSlide + 1} of {slides.length}</span>
            <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                className="h-full bg-blue-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content: Set to scroll if content overflows, but optimized to fill screen */}
        <div className="flex-grow p-4 overflow-y-auto relative bg-slate-50/50">
          {slides[currentSlide]}
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="flex items-center px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>

          <div className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold hidden sm:block">Interactive Training Module</div>

          {/* Hide Next button on last slide */}
          {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                className="flex items-center px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg disabled:opacity-50 transition shadow-md text-sm font-bold"
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </button>
          ) : (
             <div className="w-[84px]"></div> // Spacer to maintain alignment
          )}
        </div>
      </div>

      <ChatbotComponent currentSlide={currentSlide} slideTitle={currentSlideTitle} />

      <style>{`
        /* Hide scrollbar for webkit browsers */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
