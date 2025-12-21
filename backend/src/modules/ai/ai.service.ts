import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            console.error('CRITICAL: GEMINI_API_KEY is missing from configuration');
        } else {
            console.log(`AiService initialized with API Key: ${apiKey.substring(0, 4)}...`);
        }
        this.genAI = new GoogleGenerativeAI(apiKey || '');
        // Using stable model gemini-1.5-flash
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });
    }

    async generateProposal(requirementContext: string, trainerProfile: string): Promise<string> {
        const prompt = `
      You are an expert proposal writer for corporate training.
      
      Requirement:
      ${requirementContext}
      
      Trainer Profile:
      ${trainerProfile}
      
      Link the trainer's skills to the requirement and write a professional, persuasive proposal.
      Keep it under 300 words. Format as clean text paragraphs.
    `;

        try {
            console.log('Generating proposal with prompt length:', prompt.length);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating proposal:', error);
            throw error;
        }
    }

    async interpretRequirements(rawText: string): Promise<any> {
        const prompt = `
      Extract the following fields from the training requirement text:
      - title (string)
      - skills (array of strings)
      - budgetMin (number, optional)
      - budgetMax (number, optional)
      - location (string, optional)
      - duration (string, optional)
      
      Text: "${rawText}"
    `;

        try {
            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ],
            });
            const response = await result.response;
            const text = response.text();
            console.log('AI Raw Response:', text);
            // Cleanup markdown if present to ensure parsing success
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            console.error('Error interpreting requirements:', error);
            // Fallback to empty object or throw readable error
            throw new Error('Failed to interpret requirements. Please try again.');
        }
    }
    async generateProposalJSON(requirement: any, college: any, vendor: any): Promise<any> {
        const prompt = `
            You are an expert corporate training proposal generator.
            Generate a detailed, professional training proposal in JSON format based on the following context.

            CONTEXT:
            Requirement Title: ${requirement.title}
            Description: ${requirement.description}
            Budget: $${requirement.budgetMin} - $${requirement.budgetMax}
            
            College: ${college.name} (${college.city || ''})
            Vendor: ${vendor.name}

            OUTPUT FORMAT (JSON ONLY):
            {
                "title": "Professional Training Proposal for [Title]",
                "modules": ["Module 1: ...", "Module 2: ...", ...],
                "timeline": "e.g. 2 weeks / 40 hours",
                "trainerCount": 1,
                "costing": [Cost based on budget, just a number],
                "terms": "Standard terms and conditions...",
                "emailSubject": "Proposal: ${requirement.title}",
                "emailBody": "Dear Team,\n\nPlease find attached..."
            }
            Do not include markdown pricing or extra text. Just validity JSON.
        `;

        try {
            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' }
            });
            const response = await result.response;
            const text = response.text();

            // Cleanup
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            console.error('Error generating proposal JSON:', error);
            // Return fallback/default structure
            return {
                title: `Proposal for ${requirement.title}`,
                modules: ['Introduction', 'Core Concepts', 'Advanced Topics'],
                timeline: 'To be discussed',
                trainerCount: 1,
                costing: requirement.budgetMin || 0,
                terms: 'Standard terms apply.',
                emailSubject: `Proposal: ${requirement.title}`,
                emailBody: 'Please find our proposal attached.'
            };
        }
    }
}
