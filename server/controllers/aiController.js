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


export const estimateProjectCost = async (req, res) => {
  try {
    const { description } = req.body;

    const prompt = `
You are an experienced software architect.

Project Description:
${description}

Estimate:

1. Development Time
2. Team Size
3. Estimated Cost (USD)
4. Difficulty (Easy/Medium/Hard)
5. Explanation

Return the response using clear headings.
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


export const recommendFreelancers = async (req, res) => {
  try {
    const { projectDescription } = req.body;

    const prompt = `
You are a freelance hiring expert.

Based on the following project:

${projectDescription}

Recommend the ideal freelancer profile.

Include:

1. Required Skills
2. Experience Level
3. Recommended Budget Range
4. Why this freelancer fits
5. Additional Hiring Tips

Return the response using headings.
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