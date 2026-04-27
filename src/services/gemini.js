import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are NirvachAI, an expert Election Process Education Assistant specializing in Indian democracy and the electoral system. Your role is to educate citizens about:

1. The Indian election process (Lok Sabha, Rajya Sabha, State Assemblies, Local Bodies)
2. The Election Commission of India (ECI) and its role
3. Voter registration and eligibility
4. Electronic Voting Machines (EVMs) and VVPAT
5. Model Code of Conduct
6. Election timelines and phases
7. Constitutional provisions related to elections (Articles 324-329)
8. NOTA, postal ballots, and special voting provisions
9. The SVEEP program for voter education
10. Historical election milestones

Guidelines:
- Always provide accurate, factual information based on official ECI guidelines
- Be educational, neutral, and non-partisan — never express political opinions
- When discussing candidates or parties, remain strictly factual and balanced
- Cite relevant Articles of the Constitution when applicable
- Direct users to official ECI resources (eci.gov.in, voters.eci.gov.in) for official procedures
- If asked about topics outside election education, politely redirect to election-related topics
- Use simple, accessible language suitable for first-time voters
- Include relevant examples and analogies to make concepts clearer
- Format responses with clear headings and bullet points when appropriate
- Always include a disclaimer when information may vary by state or election type

Remember: You are an educational tool, not a source of election news or predictions. Always recommend official channels for the most current information.`;

let aiClient = null;

/**
 * Get or create the Gemini AI client
 */
const getClient = () => {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key') {
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

/**
 * Generate a response from Gemini AI for election-related queries
 * @param {string} userMessage - The user's question
 * @param {Array} chatHistory - Previous messages for context
 * @returns {Promise<string>} The AI response
 */
export const generateChatResponse = async (userMessage, chatHistory = []) => {
  const client = getClient();

  if (!client) {
    return getFallbackResponse(userMessage);
  }

  try {
    // Build conversation context
    const contextMessages = chatHistory.slice(-10).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        ...contextMessages,
        { role: 'user', parts: [{ text: userMessage }] },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.9,
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      },
    });

    return response.text || 'I apologize, but I was unable to generate a response. Please try rephrasing your question about the election process.';
  } catch (error) {
    console.error('Gemini API error:', error);

    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      return '⚠️ I\'m currently handling many requests. Please wait a moment and try again. In the meantime, you can explore the Timeline or Quiz sections!';
    }

    return getFallbackResponse(userMessage);
  }
};

/**
 * Provide intelligent fallback responses when API is unavailable
 */
const getFallbackResponse = (query) => {
  const q = query.toLowerCase();

  const responses = {
    voting: `🗳️ **Voting in Indian Elections**\n\nEvery Indian citizen aged 18+ who is registered on the electoral roll has the right to vote. Here's what you need to know:\n\n• **Registration**: Apply online at voters.eci.gov.in or through the Voter Helpline App\n• **ID Required**: Voter ID (EPIC) is the primary document, but 12 other IDs are also accepted\n• **Voting Process**: Visit your assigned polling booth, get your finger inked, and cast your vote on the EVM\n• **VVPAT**: A printed slip shows your vote choice for 7 seconds for verification\n\n📌 Explore the **Timeline** section to understand the full election process step by step!`,

    evm: `🖥️ **Electronic Voting Machines (EVMs)**\n\nEVMs have been used in all Indian elections since 2004. Key facts:\n\n• **Components**: Ballot Unit (voter presses button) + Control Unit (with polling officer)\n• **No Internet**: EVMs are standalone devices — they cannot be hacked remotely\n• **VVPAT**: Voter Verifiable Paper Audit Trail prints a slip showing your choice\n• **One-time use**: Each EVM is used only once and then sealed\n• **Capacity**: Each EVM can record up to 2,000 votes\n\n🔗 Visit eci.gov.in for official documentation on EVM security.`,

    register: `📝 **Voter Registration**\n\nYou can register to vote if you are:\n• An Indian citizen\n• Aged 18 years or above (as on January 1 of the revision year)\n• A resident of the constituency\n\n**How to Register:**\n1. Visit voters.eci.gov.in\n2. Fill Form 6 online\n3. Upload passport-size photo and age proof\n4. Submit and track your application\n\n📱 You can also use the **Voter Helpline App** available on Google Play and App Store.\n\nCheck the **Voter Checklist** section for a complete readiness guide!`,

    eci: `🏛️ **Election Commission of India (ECI)**\n\nThe ECI is an autonomous constitutional body established under Article 324:\n\n• **Established**: 25 January 1950 (celebrated as National Voters' Day)\n• **Composition**: Chief Election Commissioner + 2 Election Commissioners\n• **Headquarters**: Nirvachan Sadan, New Delhi\n• **Functions**: Conducts free & fair elections, prepares electoral rolls, enforces Model Code of Conduct\n• **Independence**: Members can only be removed through impeachment\n\nThe ECI oversees elections for the President, Vice-President, Parliament, and State Legislatures.`,

    nota: `❌ **NOTA — None of the Above**\n\nNOTA was introduced in Indian elections following the Supreme Court's judgment in PUCL v. Union of India (2013):\n\n• **Purpose**: Allows voters to reject all candidates\n• **Position**: Last button on the EVM ballot unit\n• **Legal Effect**: Even if NOTA gets the highest votes, the candidate with the most votes among the contestants wins\n• **Significance**: It's a democratic right to express dissatisfaction with all candidates\n\nNOTA symbolizes the voter's right to reject — an important aspect of democratic freedom!`,
  };

  if (q.includes('vote') || q.includes('voting') || q.includes('ballot')) return responses.voting;
  if (q.includes('evm') || q.includes('machine')) return responses.evm;
  if (q.includes('register') || q.includes('enrollment') || q.includes('enrol')) return responses.register;
  if (q.includes('commission') || q.includes('eci')) return responses.eci;
  if (q.includes('nota') || q.includes('none of the above')) return responses.nota;

  return `👋 Welcome to **NirvachAI**!\n\nI'm your Election Process Education Assistant. I can help you learn about:\n\n• 🗳️ How voting works in India\n• 📋 Voter registration process\n• 🏛️ Role of the Election Commission\n• 📊 Election timelines and phases\n• 🖥️ EVMs and VVPAT technology\n• ❌ NOTA and special provisions\n\nAsk me anything about the Indian election process! You can also explore the **Timeline**, **Quiz**, and **Encyclopedia** sections for interactive learning.\n\n💡 *Tip: Try asking "How does an EVM work?" or "What are the steps in an election?"*`;
};

/**
 * Generate quiz question explanation using AI
 */
export const generateQuizExplanation = async (question, correctAnswer, userAnswer) => {
  const client = getClient();

  if (!client) {
    return `The correct answer is "${correctAnswer}". ${question.explanation || 'Explore the Encyclopedia section to learn more about this topic!'}`;
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `The user answered "${userAnswer}" to the question "${question.question}". The correct answer is "${correctAnswer}". Provide a brief, educational explanation (2-3 sentences) about why the correct answer is right, in the context of Indian elections. Be encouraging and informative.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 200,
        temperature: 0.5,
      },
    });

    return response.text || question.explanation || `The correct answer is "${correctAnswer}".`;
  } catch {
    return question.explanation || `The correct answer is "${correctAnswer}".`;
  }
};
