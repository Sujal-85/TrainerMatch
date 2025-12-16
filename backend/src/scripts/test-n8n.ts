import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Adjust path to point to backend root .env
// execution from backend root: node src/scripts/test-n8n.js or ts-node src/scripts/test-n8n.ts
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const url = process.env.N8N_WEBHOOK_URL;

console.log('---------------------------------------------------');
console.log('Testing N8N Webhook Integration');
console.log('---------------------------------------------------');

if (!url) {
    console.error('ERROR: N8N_WEBHOOK_URL is not defined in .env file.');
    console.log('Please add N8N_WEBHOOK_URL=... to d:/Avalytics/backend/.env');
    process.exit(1);
}

console.log(`Target URL: ${url}`);

async function runTest() {
    const payload = {
        type: 'EMAIL',
        recipient: 'khedekarsujay3@gmail.com',
        data: {
            subject: 'N8N Integration Test',
            message: 'Hello! This is a test message from the Avalytics Backend to verify the n8n workflow is receiving data correctly.',
            source: 'Manual Test Script',
            time: new Date().toISOString()
        }
    };

    console.log('\nSending Payload:');
    console.log(JSON.stringify(payload, null, 2));

    try {
        const start = Date.now();
        const response = await axios.post(url, payload);
        const duration = Date.now() - start;

        console.log('\nSUCCESS: Webhook triggered successfully!');
        console.log(`Status Code: ${response.status} ${response.statusText}`);
        console.log(`Response Time: ${duration}ms`);
        console.log('Response Body:', response.data);
    } catch (error: any) {
        console.error('\nFAILURE: Failed to trigger webhook.');
        console.error(`Error Message: ${error.message}`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Response Data:', error.response.data);
        }
    }
}

runTest();
