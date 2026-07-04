import ai from "../config/gemini.js";

export const generateProjectScope = async (req, res) => {
  try {
    const { description } = req.body;

    const prompt = `
You are a software project consultant.

Based on the following project description:

"${description}"

Generate:

1. Project Modules
2. Recommended Tech Stack
3. Estimated Development Duration
4. Additional Suggestions

Return the response in clear headings.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      result: response.text,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};