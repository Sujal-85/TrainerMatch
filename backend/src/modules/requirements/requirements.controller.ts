import { Controller, Post, Get, Param, Res, UseGuards, Body, Request } from '@nestjs/common';
import { Response } from 'express';
import { RequirementsService } from './requirements.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

@Controller('requirements')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) { }

  @Post()
  @Roles('VENDOR_ADMIN', 'VENDOR_USER')
  async create(@Body() createRequirementDto: any, @Request() req) {
    const fs = require('fs');
    const logData = `[${new Date().toISOString()}] Create Requirement Request:\nUser: ${JSON.stringify(req.user)}\nBody: ${JSON.stringify(createRequirementDto)}\n\n`;
    fs.appendFileSync('debug_logs.txt', logData);

    const user = req.user;
    if (user && user.vendorId) {
      createRequirementDto.vendorId = user.vendorId;
    }

    if (!createRequirementDto.collegeId) {
      throw new Error('College selection is required. Please reload the page if the list is empty.');
    }

    try {
      const result = await this.requirementsService.create(createRequirementDto);
      fs.appendFileSync('debug_logs.txt', `Success: ${JSON.stringify(result)}\n\n`);
      return result;
    } catch (error) {
      fs.appendFileSync('debug_logs.txt', `Error: ${error.message}\nStack: ${error.stack}\n\n`);
      throw error;
    }
  }

  @Get()
  @Roles('VENDOR_ADMIN', 'VENDOR_USER', 'SUPER_ADMIN', 'TRAINER')
  async getRequirements() {
    return this.requirementsService.findAll();
  }

  @Post(':id/generate-proposal')
  @Roles('VENDOR_ADMIN', 'VENDOR_USER')
  async generateProposal(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() body: { templateType?: string }
  ) {
    // In a real implementation, this would call an AI service to generate the proposal
    // For now, we'll return a mock proposal

    const mockProposal = {
      id: `proposal-${Date.now()}`,
      requirementId: id,
      title: "AI Training Program Proposal",
      modules: [
        {
          name: "Introduction to Machine Learning",
          duration: "2 days",
          objectives: "Understand fundamental ML concepts"
        },
        {
          name: "Deep Learning Fundamentals",
          duration: "3 days",
          objectives: "Learn neural networks and deep learning"
        }
      ],
      timeline: "5 weeks",
      costing: {
        trainerFee: 5000,
        materials: 500,
        total: 5500
      },
      terms: "Payment due within 30 days of session completion"
    };

    // Generate PDF
    const filename = `proposal-${id}.pdf`;
    const filePath = `/tmp/${filename}`;

    const doc = new PDFDocument();
    const stream = doc.pipe(createWriteStream(filePath));

    doc.fontSize(20).text('Training Proposal', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Requirement ID: ${id}`);
    doc.moveDown();
    doc.fontSize(14).text(`Title: ${mockProposal.title}`);
    doc.moveDown();

    doc.fontSize(12).text('Modules:');
    mockProposal.modules.forEach((module, index) => {
      doc.text(`${index + 1}. ${module.name} (${module.duration})`);
      doc.text(`   Objectives: ${module.objectives}`);
      doc.moveDown();
    });

    doc.text(`Timeline: ${mockProposal.timeline}`);
    doc.text(`Total Cost: $${mockProposal.costing.total}`);
    doc.text(`Terms: ${mockProposal.terms}`);

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, filename);
    });
  }

  @Get(':id/sample-prompt')
  @Roles('VENDOR_ADMIN', 'VENDOR_USER')
  async getSamplePrompt(@Param('id') id: string) {
    // Return sample prompt templates for LLM
    return {
      classificationPrompt: `Classify the following training requirement:
      
      Requirement ID: ${id}
      Context: College is looking for a trainer for their computer science students.
      
      Please analyze and categorize this requirement by:
      1. Primary subject area
      2. Skill level (beginner/intermediate/advanced)
      3. Recommended trainer qualifications
      4. Estimated duration`,

      proposalPrompt: `Generate a comprehensive training proposal for the following requirement:
      
      Requirement Details:
      - Subject: Computer Science and AI
      - Target Audience: Undergraduate students
      - Duration: 2 weeks
      - Budget Range: $5000-$7000
      
      Please provide:
      1. Detailed module breakdown with learning objectives
      2. Timeline and schedule
      3. Costing breakdown
      4. Terms and conditions
      5. Trainer bio and qualifications`,

      matchExplanationPrompt: `Explain why the following trainer is a good match for requirement ${id}:
      
      Trainer Profile:
      - Name: John Smith
      - Skills: Machine Learning, Python, Data Science
      - Experience: 5 years
      - Rating: 4.8/5
      
      Requirement:
      - Topic: AI and Machine Learning training
      - Duration: 2 weeks
      - Budget: $6000
      
      Please explain the match considering:
      1. Skills alignment
      2. Experience relevance
      3. Value proposition
      4. Any potential concerns`
    };
  }
}