import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    return storedChatHistory ? JSON.parse(storedChatHistory) : [];
  });
  const [carts, setCarts] = useState([]);
  const [customs, setCustoms] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatHistoryRef = useRef(null);
  const inputRef = useRef(null);

  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("https://fastlane-sand.vercel.app/api/carts"),
      axios.get("https://fastlane-sand.vercel.app/api/customs"),
    ])
      .then(([cartResponse, customResponse]) => {
        setCarts(cartResponse.data);
        console.log(cartResponse.data);
        setCustoms(customResponse.data);
        // console.log(customResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const saveChatHistoryToLocalStorage = (history) => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  };

  const addToChatHistory = (message) => {
    setChatHistory((prevHistory) => [...prevHistory, message]);
    saveChatHistoryToLocalStorage([...chatHistory, message]);
  };

  const cartMessages = carts.map((cart) => {
    const name = cart.name;
    const notes = cart.notes;

    return `Cart name: ${name}, cart notes: ${notes}`;
  });

  const customMessages = customs.map((custom) => {
    const name = custom.name;
    const notes = custom.notes;

    return `custom name: ${name}, custom notes: ${notes}`;
  });

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    setLoading(true);

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Act as a helpful chatbot that creates email templates for engineers to send to merchants. These are the carts ${cartMessages} and custom integrations ${customMessages} available. You will receieve a problem and you will create a template email that the engineer can send the merchant with the relevant information. Only help users with information relevant to cart and custom integrations. Common issues are that the account is not fully subscribed this is the onboarding link that they need to go to click login on the bottom of the page. If the prompt says the account isn't subscribed this is the onboarding link https://www.paypal.com/unifiedonboarding/entry?&products=ppcp. Format responses if they are emails.`,
        },
        ...chatHistory,
        { role: "user", content: inputText },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const newMessage = response.data.choices[0].message.content;
      addToChatHistory({ role: "user", content: inputText });
      addToChatHistory({ role: "assistant", content: newMessage });
      setInputText("");
      inputRef.current.focus(); // Return focus to input after sending message
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent textarea from adding newline
      sendMessage();
    }
  };

  const renderChatMessage = (message, index) => {
    const isCartNote = carts.some((cart) =>
      message.content.includes(cart.Notes)
    );
    const isCustomNote = customs.some((custom) =>
      message.content.includes(custom.Notes)
    );

    return (
      <div
        key={index}
        className={message.role === "user" ? "text-right mb-2" : "mb-2"}>
        <span
          className={`inline-block p-2 rounded-lg ${
            message.role === "user"
              ? "bg-black text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          style={{ wordWrap: "break-word" }}>
          {isCartNote || isCustomNote ? (
            <>{message.content}</>
          ) : (
            message.content
          )}
        </span>
      </div>
    );
  };

  return (
    <div className={`mt-10 border-4 p-4 rounded-lg `}>
      <h2 className="text-3xl font-bold mb-4">CHATBOT</h2>
      <div
        className="chat-history mb-4"
        ref={chatHistoryRef}
        style={{ maxHeight: "300px", overflowY: "auto" }}>
        {chatHistory.map(renderChatMessage)}
      </div>
      <div className="flex items-center">
        <textarea
          ref={inputRef}
          type="text"
          placeholder="Ask me anything"
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-grow mr-2 p-2 rounded-lg border border-gray-400 focus:outline-none"
          aria-label="Chatbot input"
        />
        <button
          onClick={sendMessage}
          disabled={!inputText.trim() || loading}
          className={`p-2 rounded-lg ${
            !inputText.trim() || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-regal-pink hover:bg-regal-pink dark:bg-regal-blue text-white"
          }`}
          aria-label={loading ? "Sending..." : "Send message"}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};
