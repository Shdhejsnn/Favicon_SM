import React, { useState } from "react";
import axios from "axios";

interface IdeaSection {
    title: string;
    ideas: string[];
}

const InnovationLabPage: React.FC = () => {
    const [topic, setTopic] = useState("");
    const [sections, setSections] = useState<IdeaSection[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateIdeas = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic.");
            return;
        }
        setError("");
        setLoading(true);
        setSections([]);

        try {
            const response = await axios.post("http://localhost:5000/innovation/generate", { topic });
            setSections(response.data.sections || []);
        } catch (err) {
            setError("Failed to generate ideas. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Innovation Lab</h2>
            <input
                type="text"
                placeholder="Enter research topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                disabled={loading}
            />
            <button
                onClick={handleGenerateIdeas}
                className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md transition ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                }`}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Ideas"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {sections.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Generated Ideas:</h3>
                    {sections.map((section, index) => (
                        <div key={index} className="mt-4 p-4 border rounded-md shadow-sm">
                            <h4 className="text-xl font-bold text-blue-600">{section.title}</h4>
                            <ul className="list-disc pl-5 mt-2">
                                {section.ideas.map((idea, idx) => (
                                    <li key={idx} className="text-gray-700">{idea}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InnovationLabPage;